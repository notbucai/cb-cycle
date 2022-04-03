export enum TaskStatus {
  ING = 'ing',
  STOP = 'stop',
}

export enum ChildTaskStatus {
  INIT = 'init',
  BUILDING = 'building',
  DOWNLOADING = 'downloading',
  RUNING = 'runing',
  STOPING = 'stoping',
  COPYING = 'copying',
  BINDING = 'binding',
  STOP = 'stop',
  DENO = 'deno',
  ERROR = 'error',
}

export const TaskStatusTag: { [key: string]: { type: 'default' | 'info' | 'warning'; title: string } } = {
  [TaskStatus.ING]: {
    type: 'info',
    title: '运行中'
  },
  [TaskStatus.STOP]: {
    type: 'default',
    title: '已停止'
  },
  'warn': {
    title: '执行异常',
    type: 'warning'
  },
}