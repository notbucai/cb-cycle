import { Service } from 'egg';
import { inc } from 'semver';
import * as ejs from 'ejs';
import { Author, TaskType } from '../types/base';
import { ChildTaskStatus } from '../constant/status';
import build from '../core/task/build';
import {
  mkdirSync,
  existsSync,
  appendFileSync,
  openSync,
  PathOrFileDescriptor,
  close,
  writeFileSync
} from 'fs';
import * as moment from 'moment';
import { relative, resolve } from 'path';
import * as compressing from 'compressing';
import copy from '../core/task/copy';
import * as restart from '../core/task/restart';
import run from '../core/task/run';
import down from '../core/task/down';
import { ChildProcess } from 'child_process';

import { Task as TaskModel } from '../../models/Task';
import { Template as TemplateModel } from '../../models/Template';
import { User as UserModel } from '../../models/User';
import { TaskChild as TaskChildModel } from '../../models/TaskChild';
import { HttpException } from '../exception/HttpException';
import ResponseConstant from '../constant/response';
// import { Platform as PlatformModel } from '../../models/Platform';

/**
 * Task Service
 */
export default class Task extends Service {

  private static readonly dataPath: string = '/data/ci/data';
  private static readonly nginxPath: string = '/data/docker/nginx';
  private static readonly nginxConfigPath: string = resolve(Task.nginxPath, 'conf.d');
  private static readonly projectsPath: string = resolve(Task.dataPath, 'projects');
  // private static readonly tasksPath: string = resolve(Task.dataPath, 'tasks');
  private static readonly templatePath: string = resolve(Task.dataPath, 'template');
  private static readonly templateDockerPath: string = resolve(Task.templatePath, 'docker');
  private static readonly templateNginxPath: string = resolve(Task.templatePath, 'nginx');

  async down (taskChild: TaskChildModel) {
    // down
    const activeId = taskChild.id;
    const taskSourcePath = resolve(Task.projectsPath, activeId);
    // taskSourcePath
    const isDirectory = existsSync(taskSourcePath);
    if (!isDirectory) {
      return;
    }
    const isFile = existsSync(resolve(taskSourcePath, 'docker-compose.yml'));
    if (!isFile) {
      return;
    }
    return new Promise((ro, re) => {
      down({
        cwdPath: taskSourcePath,
        deno: () => {
          console.log('down deno');
          ro(void 0);
        },
        error (error) {
          console.log('down error ', error);
          re(error);
        },
        progress (chunk) {
          console.log('down -> ', chunk?.toString());
        }
      });
    });
  }

  writeLog (file: PathOrFileDescriptor, log: string) {
    try {
      appendFileSync(file, Buffer.concat([Buffer.from(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]: `), Buffer.from(log)]));
    } catch (error) {
      this.logger.error(error);
    }
  }

  async run (task: TaskModel, commitUser: Author) {
    const { app } = this;
    // 查找当前任务
    const childInfo = {
      task_id: task.id,
      version: '0.0.1'
    };
    const oldActiveId = task.activeId || '';
    const userId = task.userId;
    const userModel = await app.model.User.findByPk(userId);
    this.logger.info(userModel);
    // 更新版本
    if (oldActiveId) {
      const childModel = await this.app.model.TaskChild.findByPk(oldActiveId);
      this.logger.info(childModel);
      if (childModel) {
        const oldVersion = childModel.version || '';
        childInfo.version = inc(oldVersion, 'patch') || childInfo.version;
      }
    }
    // 创建子任务
    const newActiveChildModel = await app.model.TaskChild.create({
      taskId: childInfo.task_id,
      status: ChildTaskStatus.INIT,
      buildLog: '',
      deployLog: '',
      commitEmail: commitUser.email,
      version: childInfo.version
    });
    // 数据位置
    const taskSourcePath = resolve(Task.projectsPath, newActiveChildModel.id);
    // 创建路径
    mkdirSync(taskSourcePath, { recursive: true });
    this.logger.info({
      newActiveChildModel,
      taskSourcePath
    });
    // 创建日志所需文件
    const initFilePath = resolve(taskSourcePath, 'init.log');
    const initFile = openSync(initFilePath, 'a');
    newActiveChildModel.update({
      initLog: initFilePath
    });
    this.writeLog(initFile, `任务被触发\n绑定[activeId: ${newActiveChildModel.id}]\n`);

    // 绑定child task id
    await task.update({
      activeId: newActiveChildModel.id
    });
    this.writeLog(initFile, `绑定成功\n开始查找配置 [templateId: ${task.templateId}]\n`);

    this.writeLog(initFile, '配置查找成功\n 准备开始下载代码...\n');
    // const templatePath =
    newActiveChildModel.update({
      status: ChildTaskStatus.DOWNLOADING
    });
    // 查找配置
    const templateId = task.templateId;
    const templateModel = await app.model.Template.findByPk(templateId);
    const isStructure = templateModel?.isStructure;
    this.logger.info({ templateModel });

    // 拉最新代码
    this.download(task).then(async codePath => {
      this.logger.info({ download: 'deno', codePath });
      this.writeLog(initFile, `代码下载成功，${isStructure ? '准备编译中' : '即将部署'}...\n`);
      close(initFile);
      // 是否构建 需要构建的一律走内部逻辑
      if (isStructure) {
        this.structure({
          oldActiveId,
          task,
          user: userModel || void 0,
          template: templateModel || void 0,
          taskChild: newActiveChildModel,
          path: {
            source: taskSourcePath,
            template: Task.templateDockerPath,
            code: codePath
          }
        });
      } else {
        // 一律认为是静态资源
        // 直接写入nginx
        newActiveChildModel.update({
          status: ChildTaskStatus.BINDING
        });
        const deployFilePath = resolve(taskSourcePath || '', 'deploy.log');
        const deployFile = openSync(deployFilePath, 'a');
        newActiveChildModel.update({
          deployLog: deployFilePath
        });
        this.writeLog(deployFile, `开始部署中${''} \n`);
        const bindNginxRes = await this.bindNginx(task.id, TaskType.WEB, {
          path: codePath,
          serverPort: task.serverPort,
          externalPort: task.externalPort
        });
        this.writeLog(deployFile, `PID: ${bindNginxRes.handle.process?.pid} \n`);
        await newActiveChildModel.update({
          bindPid: bindNginxRes.handle.process?.pid
        });
        try {
          await bindNginxRes.exec;
          this.writeLog(deployFile, `部署成功 ${' '} \n`);
          newActiveChildModel.update({
            status: ChildTaskStatus.DENO
          });
        } catch (error: any) {
          this.writeLog(deployFile, `部署失败 Error: ${error}\n ${error?.name}\n${error?.message}\n${error?.stack} \n`);
          newActiveChildModel.update({
            status: ChildTaskStatus.BUILD_ERROR
          });
        }
      }
    }).catch(e => {
      newActiveChildModel.update({
        status: ChildTaskStatus.DOWNLOAD_ERROR
      });
      this.writeLog(initFile, `代码下载失败\n ${e}\n ${e?.name}: ${e?.message}\n${e?.stack}\n`);
    });
    return {
      id: task.id,
      userId: task.userId,
      taskName: task.taskName,
    };
  }

  async download (task: TaskModel) {
    this.logger.info({ download: 'init' });
    const platformId = task.platformId;
    const owner = task.owner;
    const repository = task.repository;
    const branch = task.branch;
    const activeId = task.activeId;
    const platformModel = await this.app.model.Platform.findByPk(platformId, {
      include: [
        {
          as: 'platformConfig',
          model: this.app.model.PlatformConfig,
        }
      ]
    });
    const token = platformModel?.token;
    this.logger.info(task);
    const projectPath = resolve(Task.projectsPath, activeId || '');

    // const zipPath = resolve(projectPath, 'code.zip');
    const uncompressPath = resolve(projectPath);
    // const zipStream = createWriteStream();
    const dataUrl = platformModel?.platformConfig?.downloadRepoUrl
      ?.replace('${owner}', owner || '')
      .replace('${repository}', repository)
      .replace('${branch}', branch) || '';
    this.logger.info({ download: '1', uncompressPath, path: dataUrl });
    const result = await this.app.httpclient.curl(dataUrl, {
      streaming: true,
      followRedirect: true,
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    this.logger.info({ download: '2', result });
    const zipPath = (result.headers['content-disposition'] as string || '').split('filename=')[1].replace('.zip', '');
    this.logger.info({ zipPath });
    await compressing.zip.uncompress(result.res as any, uncompressPath);
    this.logger.info({ download: '3', m: 'uncompress deno' });
    return resolve(uncompressPath, zipPath);
  }

  private async structure (
    {
      oldActiveId, task, template, taskChild, user, path
    }:
      {
        oldActiveId: string;
        task: TaskModel;
        taskChild: TaskChildModel;
        template?: TemplateModel;
        user?: UserModel;
        path: { template: string; source: string; code: string; };
      }
  ) {
    const structureFilePath = resolve(path.source, 'structure.log');
    const deployFilePath = resolve(path.source || '', 'deploy.log');
    const structureFile = openSync(structureFilePath, 'a');
    const deployFile = openSync(deployFilePath, 'a');
    taskChild.update({
      deployLog: deployFilePath,
      buildLog: structureFilePath
    });
    this.writeLog(structureFile, `开始构建镜像\n 正在编译模版 [${template?.type}]\n`);
    await taskChild.update({
      status: ChildTaskStatus.BUILDING
    });
    // 异步编译
    // 读取 编译模版文件
    const dockerfilePath = resolve(path.template, 'df.build.template.txt');
    const dockerComposePath = resolve(path.template, 'dc.build.template.txt');
    // 替换配置
    const relativeCodePath = relative(path.source, path.code);
    this.logger.info({ relativeCodePath });
    const inject = {
      user,
      task,
      taskChild,
      path: {
        ...path,
        code: relativeCodePath
      },
      template
    };
    this.logger.info({ inject });
    const renderDFStr = await ejs.renderFile(dockerfilePath, inject);
    const renderDCStr = await ejs.renderFile(dockerComposePath, inject);
    this.writeLog(structureFile, `镜像配置成功 ${' '}\n写入配置中\n`);

    // 写入 任务配置
    const configPath = resolve(path.source);
    // 创建目录
    mkdirSync(configPath, { recursive: true });
    writeFileSync(resolve(configPath, 'Dockerfile'), renderDFStr);
    writeFileSync(resolve(configPath, 'docker-compose.yml'), renderDCStr);
    this.writeLog(structureFile, `写入配置成功 ${' '} \n开始触发构建...\n`);

    // // 执行
    const { controller, process } = build({
      configPath,
      deno: async () => {
        this.writeLog(structureFile, `${template?.isBuild ? '构建并编译成功。' : '构建成功。'} \n准备${template?.isRun ? '运行' : '部署'}\n`);
        if (template?.isRun) {
          const runFilePath = resolve(path.source, 'run.log');
          const runFile = openSync(runFilePath, 'a');
          taskChild.update({
            runLog: runFilePath
          });
          this.writeLog(runFile, `开始运行... ${' '}\n`);

          await taskChild.update({
            status: ChildTaskStatus.RUNING
          });
          // 只有需要运行的任务才需要停止
          // 停止容器
          if (oldActiveId) {
            this.writeLog(runFile, `开始停止旧容器...\n oldActiveId: ${oldActiveId}\n`);
            const childModel = await this.app.model.TaskChild.findByPk(oldActiveId);
            this.logger.info(childModel);
            if (childModel) {
              this.writeLog(runFile, `停止中...\n oldActiveId: ${oldActiveId}\n`);

              await childModel.update({
                status: ChildTaskStatus.STOPING
              });
              try {
                // 必须存在旧的子任务才能被down
                await this.down(childModel);
                this.writeLog(runFile, `停止成功...\n oldActiveId: ${oldActiveId}\n`);

                await childModel.update({
                  status: ChildTaskStatus.STOP
                });
              } catch (error: any) {
                this.logger.error(error);
                this.writeLog(runFile, `停止失败~> Error: ${error}\n ${error?.name}\n ${error?.message}\n${error?.stack}\n`);
                taskChild.update({
                  status: ChildTaskStatus.STOP_ERROR
                });
                throw error;
              }
            }
          }
          this.writeLog(runFile, `准备启动 ${' '}\n`);
          // 运行容器
          const runHandle = run({
            cwdPath: configPath,
            deno: async () => {
              this.writeLog(runFile, `运行成功，开始准备部署 ${' '}\n`);
              console.log('run deno');
              await taskChild.update({
                status: ChildTaskStatus.BINDING
              });
              // 成功后操作
              // 写入nginx
              this.writeLog(deployFile, `开始部署 ${' '}\n`);
              const bindNginxRes = await this.bindNginx(
                task.id,
                TaskType.SERVICE,
                {
                  serverPort: task.serverPort,
                  externalPort: task.externalPort,
                  ip: task.ip,
                }
              );
              this.writeLog(deployFile, `部署中 PID: ${bindNginxRes.handle.process?.pid}\n`);
              await taskChild.update({
                bindPid: bindNginxRes.handle.process?.pid
              });
              try {
                await bindNginxRes.exec;
                this.writeLog(deployFile, `部署成功 ${' '}\n`);

                await taskChild.update({
                  status: ChildTaskStatus.DENO
                });
              } catch (error: any) {
                this.logger.error(error);
                this.writeLog(deployFile, `bind Error: ${error}\n ${error?.name}\n${error?.message}\n${error?.stack} \n`);
                await taskChild.update({
                  status: ChildTaskStatus.BIND_ERROR
                });
                throw error;
              }
            },
            error: (error: any) => {
              console.log('error run ', error);
              this.writeLog(deployFile, `运行失败 Error: ${error}\n ${error?.name}\n${error?.message}\n${error?.stack} \n`);
              taskChild.update({
                status: ChildTaskStatus.RUN_ERROR
              });
            },
            progress: (chunk: any) => {
              console.log('run -> ', chunk?.toString());
              this.writeLog(runFile, `run~> ${chunk?.toString()}\n`);
            }
          });
          taskChild.update({
            runPid: runHandle.process.pid
          });
          this.writeLog(runFile, `开始运行 PID: ${process?.pid}\n`);
        } else {
          console.log('to nginx');
          await taskChild.update({
            status: ChildTaskStatus.COPYING
          });
          this.writeLog(deployFile, `开始部署中 TYPE: ${' COPY '}\n`);
          // task_id
          const imageName = (task.id) + ':' + taskChild.version;
          const distPath = resolve(path.source, 'dist');
          this.writeLog(deployFile, `正在转移镜像配置：IMAGE_NAME: ${imageName}\n`);
          const copyProcess = copy({
            configPath,
            imageName,
            buildPath: task.buildPath || 'dist',
            deno: async () => {
              this.writeLog(deployFile, `镜像转移完成: ${''}\n`);
              console.log('copy deno');
              await taskChild.update({
                status: ChildTaskStatus.BINDING
              });
              this.writeLog(deployFile, `开始正式部署: ${''}\n`);
              try {
                // 成功后操作
                const bindNginxRes = await this.bindNginx(
                  task.id,
                  TaskType.WEB,
                  {
                    path: distPath,
                    serverPort: task.serverPort,
                    externalPort: task.externalPort,
                    history: task.routerMode === 'history'
                  }
                );
                this.writeLog(deployFile, `正式部署中: PID: ${bindNginxRes.handle.process?.pid}\n`);
                await taskChild.update({
                  bindPid: bindNginxRes.handle.process?.pid
                });
                await bindNginxRes.exec;
                await taskChild.update({
                  status: ChildTaskStatus.DENO
                });
                this.writeLog(deployFile, `部署成功 ${''}`);
              } catch (error: any) {
                this.logger.error(error);
                this.writeLog(deployFile, `bind Error: ${error}\n ${error?.name}\n${error?.message}\n${error?.stack} \n`);
                await taskChild.update({
                  status: ChildTaskStatus.BIND_ERROR
                });
                throw error;
              }
            },
            progress: (chunk): void => {
              this.logger.info(chunk?.toString());
              this.writeLog(deployFile, `COPY~> ${chunk?.toString()}`);
            },
            error: (error: any): void => {
              console.log('error copy ', error);
              taskChild.update({
                status: ChildTaskStatus.COPY_ERROR
              });
              this.writeLog(deployFile, `配置转移失败 Error: ${error}\n ${error?.name}\n ${error?.message}\n${error?.stack}\n`);
            }
          });
          // 写入进程号
          taskChild.update({
            copyPid: copyProcess.process.pid
          });
          this.writeLog(deployFile, `配置转移 PID: ${copyProcess.process.pid}`);
        }

      },
      error: (error: any) => {
        console.log('error', error);
        taskChild.update({
          status: ChildTaskStatus.BUILD_ERROR
        });
        this.writeLog(structureFile, `structure~> Error: ${error} \n ${error?.name}\n ${error?.message}\n${error?.stack}\n`);
      },
      progress: (chunk: any) => {
        this.writeLog(structureFile, `structure~> ${chunk?.toString()}\n`);
        console.log(chunk?.toString());
      }
    });
    this.writeLog(structureFile, `构建触发成功 [pid: ${process?.pid}]\n`);

    this.logger.info({
      controller: controller.signal,
      pid: process.pid
    });
    // 写入进程号
    taskChild.update({
      buildPid: process.pid
    });
  }

  private async bindNginx (
    configName: string,
    type: TaskType,
    opts: {
      path?: string;
      serverPort?: number;
      externalPort?: number;
      domain?: string;
      ip?: string;
      proxy?: string;
      history?: boolean;
    }
  ) {
    this.logger.info({
      message: 'bindNginx ing'
    });
    // templateNginxPath
    const templatePath = resolve(Task.templateNginxPath, 'config.txt');
    // 通过 任务类型进行nginx config生成
    const renderConfigStr = await ejs.renderFile(templatePath, {
      type,
      opts
    });
    this.logger.info({
      message: 'write ing'
    });
    // 将config 写入到 conf.d
    writeFileSync(resolve(Task.nginxConfigPath, configName + '.conf'), renderConfigStr);
    this.logger.info({
      message: 'write file deno'
    });
    this.logger.info({
      message: 'restart nginx ing'
    });
    const handle: { process?: ChildProcess; controller?: any; } = {
      controller: undefined,
      process: undefined
    };
    // 重启 nginx 容器
    // IOption
    return {
      exec: new Promise((_resolve, _reject) => {
        const _h = restart.nginx({
          cwdPath: Task.nginxPath,
          error (e) {
            console.log(e);
            _reject(e);
          },
          progress (c) {
            console.log(c.toString());
          },
          deno () {
            console.log('restart nginx deno');
            _resolve(void 0);
          }
        });
        handle.controller = _h.controller;
        handle.process = _h.process;
      }),
      handle
    };
  }

  async addWebhook (taskModel: TaskModel) {
    const userId = taskModel.userId as string;
    const platform = await this.app.model.Platform.findOne({
      where: {
        userId
      },
      include: [
        {
          model: this.app.model.PlatformConfig,
          as: 'platformConfig'
        }
      ]
    });
    if (!platform || !platform.platformConfig) throw new HttpException(ResponseConstant.FAIL.CODE);
    const config = platform.platformConfig;
    const webhookUrl = String(config.webhookUrl)
      .replace('${o}', taskModel.owner || '')
      .replace('${r}', taskModel.repository || '');
    const callbackUrl = `https://cycle.bucai.cc/api/v1/open/callback/run/${taskModel.id}`;

    const res = await this.app.httpclient.request(webhookUrl, {
      method: 'POST',
      data: {
        name: 'web',
        config: {
          url: callbackUrl,
          content_type: 'json',
          insecure_ssl: 1,
        },
        events: ['push'],
        active: true
      },
      contentType: 'json',
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${platform.token}`
      },
    });
    return res;
  }

}
