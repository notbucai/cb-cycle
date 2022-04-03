/**
 * 编译脚本
 */
import { exec } from 'child_process';

export interface IOption {
  configPath: string;
  imageName: string;
  buildPath: string;
  progress: (chunk: any) => void;
  error: (error: Error | number) => void
  deno: () => void
}

export default (option: IOption) => {
  const controller = new AbortController();
  const { signal } = controller;
  // 调用 docker 进行隔离编译
  const cmd = `docker cp $(docker create --rm ${option.imageName}):/app/${option.buildPath} ./dist`;
  console.log('cmd---> ', cmd);
  const process = exec(cmd, {
    signal,
    cwd: option.configPath
  });

  process.stdout?.on('data', (chunk: any) => {
    option.progress(chunk);
  });

  process.stderr?.on('data', (chunk: any) => {
    option.progress(chunk);
  });

  process.on('error', (err: Error) => {
    option.error(err);
  });

  process.on('exit', (code: number, signal: string) => {
    console.log('build exec', code, signal);
    if (code !== 0) {
      option.error(code);
      return;
    }
    option.deno();
  });

  return {
    controller,
    process
  };
};
