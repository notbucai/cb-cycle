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
