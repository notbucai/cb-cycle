import { Controller } from 'egg';
import { readFileSync } from 'fs';
import * as getPort from 'get-port';
import { Op } from 'sequelize';
import ResponseConstant from '../constant/response';
import { TaskStatus } from '../constant/status';
import { docker } from '../core/docker';
import { ipAddress } from '../core/utils';
import { HttpException } from '../exception/HttpException';

export default class TaskController extends Controller {
  /**
   * 任务列表
   * GET task/list
   * 接口ID：14260797
   * 接口地址：https://www.apifox.cn/web/project/741496/apis/api-14260797
   */
  public async list () {
    const { pageIndex, pageSize, ids } = this.ctx.request.body;
    this.ctx.validate({
      pageIndex: {
        type: 'number',
        max: 1000,
        min: 1,
      },
      pageSize: {
        type: 'number',
        min: 10,
        max: 1000
      }
    });
    const user = await this.ctx.service.common.currentUser();
    const where: any = {
      userId: user?.id,
    };
    if (ids && Array.isArray(ids) && ids.length) {
      where.id = {
        [Op.in]: ids
      };
    }
    const res = await this.app.model.Task.findAndCountAll({
      // attributes: ['id', 'username', 'password'],
      where,
      order: [
        ['created_at', 'DESC']
      ],
      include: [
        {
          required: false,
          model: this.app.model.User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar', 'email']
        },
        {
          required: false,
          model: this.app.model.Platform,
          as: 'platform',
          include: [
            {
              required: false,
              model: this.app.model.PlatformConfig,
              as: 'platformConfig',
            }
          ]
        },
        {
          required: false,
          model: this.app.model.Template,
          as: 'template',
        },
        {
          required: false,
          model: this.app.model.TaskChild,
          as: 'child',
        },
      ],
      limit: pageSize, // 每页多少条
      offset: pageSize * (pageIndex - 1) // 跳过多少条
    });
    return {
      results: res.rows,
      total: res.count
    };
  }
  /**
   * 创建任务
   * POST task/create
   * 接口ID：14260115
   * 接口地址：https://www.apifox.cn/web/project/741496/apis/api-14260115
   */
  public async create () {
    const {
      branch,
      buildPath,
      buildScript,
      platformId,
      repository,
      runScript,
      serverPort,
      routerMode,
      taskName,
      domain,
      owner,
      templateId
    } = this.ctx.request.body as any;
    const user = await this.ctx.service.common.currentUser();
    // 寻找端口
    const externalPort = await getPort({ port: getPort.makeRange(10000, 30000) });
    // 获取网关
    const userNetwork = docker.getNetwork(`${user?.id}-network`);
    const inspect = await userNetwork.inspect();
    const gateway = inspect?.IPAM?.Config[0]?.Subnet.split('/')[0];
    const useIps = Object.keys(inspect?.Containers).map(item => inspect.Containers[item].IPv4Address.split('/')[0]);
    const ip = ipAddress.getUsableIp(gateway, useIps);

    this.logger.info({
      inspect,
      gateway,
      useIps,
      ip,
      externalPort,
      user
    });
    // 创建
    const taskModel = await this.app.model.Task.create({
      userId: user?.id || '',
      platformId,
      templateId,
      taskName,
      status: TaskStatus.ING,
      owner,
      repository,
      branch,
      runScript,
      buildScript,
      buildPath,
      serverPort,
      externalPort,
      domain,
      ip,
      routerMode,
    });
    // 添加webhook
    const webhook = await this.service.task.addWebhook(taskModel);
    return {
      model: taskModel,
      webhook,
    };
  }
  /**
   * 子任务列表
   * GET /task/child/list
   * 接口ID：14261138
   * 接口地址：https://www.apifox.cn/web/project/741496/apis/api-14261138
   */
  public async childList () {
    const { pageIndex, pageSize } = this.ctx.request.body;
    this.ctx.validate({
      pageIndex: {
        type: 'number',
        max: 1000,
        min: 1,
      },
      pageSize: {
        type: 'number',
        min: 10,
        max: 1000
      }
    });

    return this.app.model.TaskChild.findAll({
      // attributes: ['id', 'username', 'password'],
      order: [
        ['created_at', 'DESC']
      ],
      limit: pageSize, // 每页多少条
      offset: pageSize * (pageIndex - 1) // 跳过多少条
    });
  }
  /**
   * 任务详情
   * GET /task/detail
   * 接口ID：14261136
   * 接口地址：https://www.apifox.cn/web/project/741496/apis/api-14261136
   */
  public async detail () {
    const { id } = this.ctx.request.query;
    this.ctx.validate({
      id: 'string',
    }, this.ctx.request.query);
    const taskModel = await this.app.model.Task.findByPk(id, {
      include: [
        {
          as: 'template',
          model: this.app.model.Template
        },
        {
          as: 'user',
          model: this.app.model.User
        },
        {
          as: 'child',
          model: this.app.model.TaskChild
        },
        {
          as: 'platform',
          model: this.app.model.Platform,
          include: [
            {
              as: 'platformConfig',
              model: this.app.model.PlatformConfig,
            }
          ]
        },
      ]
    });
    return taskModel;
  }
  /**
   * 子任务详情
   * GET /task/child/detail
   * 接口ID：14261534
   * 接口地址：https://www.apifox.cn/web/project/741496/apis/api-14261534
   */
  public async childDetail () {
    return {
    };
  }
  /**
   * 获取任务日志
   * GET /task/log
   * 接口ID：14261600
   * 接口地址：https://www.apifox.cn/web/project/741496/apis/api-14261600
   */
  public async log () {
    const { id, type } = this.ctx.query;
    this.ctx.validate({
      id: {
        type: 'string',
      },
      type: {
        type: 'string',
      }
    });
    // 获取日志
    const task = await this.app.model.Task.findByPk(id, {
      include: [
        {
          as: 'child',
          model: this.app.model.TaskChild
        },
      ]
    });

    const child = task?.child;
    if (!child) throw new HttpException(ResponseConstant.FAIL.CODE);

    const log = {
      build: child.buildLog,
      run: child.runLog,
      deploy: child.deployLog,
      init: child.initLog,
    }[type];
    if (!log) throw new HttpException(ResponseConstant.FAIL.CODE);
    const buffer = readFileSync(log);
    return buffer;
  }
  /**
   * 删除任务
   * DELETE task/delete
   * 接口ID：14262153
   * 接口地址：https://www.apifox.cn/web/project/741496/apis/api-14262153
   */
  public async del () {
    return {
    };
  }
  /**
   * 修改任务状态
   * PUT task/change
   * 接口ID：14262474
   * 接口地址：https://www.apifox.cn/web/project/741496/apis/api-14262474
   */
  public async changeStatus () {
    return {
    };
  }
  /**
   * 删除子任务
   * DELETE task/child/delete
   * 接口ID：14262178
   * 接口地址：https://www.apifox.cn/web/project/741496/apis/api-14262178
   */
  public async delChild () {
    return {
    };
  }

  async test () {
    const t = await this.app.model.Task.findByPk('1455fc4f-2b15-41ce-bcff-b815eb930f9d');
    this.ctx.service.task.addWebhook(t as any);
  }
}
