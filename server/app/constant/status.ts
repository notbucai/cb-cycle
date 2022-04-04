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
  STOP = 50,
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
