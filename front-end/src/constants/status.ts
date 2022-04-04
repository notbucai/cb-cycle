export enum TaskStatus {
  ING = 100,
  STOP = 200,
}

export enum ChildTaskStatus {
  INIT = 100,
  BUILDING = 101,
  DOWNLOADING = 102,
  RUNING = 110,
  STOPING = 120,
  COPYING = 130,
  BINDING = 140,
  DENO = 200,
  STOP = 500,
  // error
  ERROR = 600,
  BUILD_ERROR = 640,
  INIT_ERROR = 610,
  DOWNLOAD_ERROR = 620,
  RUN_ERROR = 630,
  COPY_ERROR = 650,
  STOP_ERROR = 660,
  BIND_ERROR = 660,
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
  'unknown': {
    title: '未知',
    type: 'default'
  },
}
export const TaskChildStatusTag: { [key: string]: { type: 'default' | 'info' | 'warning' | 'success' | 'error'; title: string } } = {
  [ChildTaskStatus.INIT]: {
    type: 'info',
    title: '初始化中'
  },
  [ChildTaskStatus.BUILDING]: {
    type: 'info',
    title: '构建中'
  },
  [ChildTaskStatus.DOWNLOADING]: {
    type: 'info',
    title: '下载中'
  },
  [ChildTaskStatus.RUNING]: {
    type: 'info',
    title: '运行中'
  },
  [ChildTaskStatus.STOPING]: {
    type: 'info',
    title: '停止旧任务'
  },
  [ChildTaskStatus.COPYING]: {
    type: 'info',
    title: '导出数据'
  },
  [ChildTaskStatus.BINDING]: {
    type: 'info',
    title: '写入配置'
  },
  [ChildTaskStatus.DENO]: {
    type: 'success',
    title: '完成'
  },
  [ChildTaskStatus.ERROR]: {
    type: 'error',
    title: '未知错误'
  },
  [ChildTaskStatus.BUILD_ERROR]: {
    type: 'error',
    title: '编译错误'
  },
  [ChildTaskStatus.INIT_ERROR]: {
    type: 'error',
    title: '初始化错误'
  },
  [ChildTaskStatus.DOWNLOAD_ERROR]: {
    type: 'error',
    title: '资源下载失败'
  },
  [ChildTaskStatus.RUN_ERROR]: {
    type: 'error',
    title: '运行失败'
  },
  [ChildTaskStatus.COPY_ERROR]: {
    type: 'error',
    title: '导出错误'
  },
  [ChildTaskStatus.STOP_ERROR]: {
    type: 'error',
    title: '停止任务错误'
  },
  [ChildTaskStatus.BIND_ERROR]: {
    type: 'error',
    title: '绑定失败'
  },
  'warn': {
    title: '执行异常',
    type: 'warning'
  },
  'unknown': {
    title: '未知',
    type: 'default'
  },
}