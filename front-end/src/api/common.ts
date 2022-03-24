import http from '../plugin/http';

export interface IOauthBindRequest {
  code: string;
}


export interface TaskListCreateTimeRange {
  start: string;
  ent: string;
}

export interface ITaskListRequest {

  pageIndex: number;

  pageSize: number;

  taskName: string;

  createTimeRange: TaskListCreateTimeRange;

  status: Array<number>;

  repository: Array<string>;
}

export interface ITaskChangeStatusRequest {

  id: string;

  status: number;
}

export interface ICreateTaskRequest {
  branch: string;

  buildPath: string;

  buildScript: string;

  platformId: string;

  repository: string;

  runScript: string;

  serverPort: string;

  taskName: string;

  templateId: string;
}

export interface ILoginRequest {

  email: string;

  code: string;
}
export interface ILoginResponse {

  token: string;
}

export interface IChildTaskListRequest {

  taskId: string;

  pageIndex: number;

  pageSize: number;

  taskName: string;

  createTimeRange: TaskListCreateTimeRange;

  status: Array<number>;
}

export interface ICommonGetCodeRequest {
  email: string;
}

export interface IListResponse<T> {
  results: Array<T>;
  total: number;
}

export interface ITemplate {
  id: string;

  createdAt: string;

  name: string;

  type: string;

  updatedAt: string;

  icon: string;

  path: string;
}

export interface InlineResponse20011Commit {

  sha: string;

  url: string;
}

export interface InlineResponse20011Protection {

  requiredStatusChecks: InlineResponse20011ProtectionRequiredStatusChecks;
}

export interface InlineResponse20011ProtectionRequiredStatusChecks {

  enforcementLevel: string;

  contexts: Array<string>;
}

export interface IRepositoryBranche {

  commit: InlineResponse20011Commit;

  protectionUrl: string;

  protection: InlineResponse20011Protection;

  name: string;

  protected: boolean;
}

export interface ITaskDetail {

  branch?: string;

  buildPath?: string;

  buildScript?: string;

  createdAt?: string;

  platformId?: string;

  repository?: string;

  runLog?: string;

  runScript?: string;

  serverPort?: string;

  taskName?: string;

  templateId?: string;

  updatedAt?: string;

  status?: number;

  id?: number;

  childId?: string;
}

export interface IRepositoryItem {

  name?: string;

  id?: string;

  nodeId?: string;

  fork?: boolean;

  createdAt?: string;

  description?: string;
}

export interface ILogResponse {
  log: string;
}

export interface IChildTaskDetail {

  id?: string;

  buildAt?: string;

  buildLog?: string;

  deployAt?: string;

  updatedAt?: string;

  taskId?: string;

  deployLog?: string;

  createdAt?: string;

  taskStatus?: number;

  taskName?: string;

  status?: string;
}

export interface IRepositoryProjectInfo {

  name: string;

  version: string;

  description: string;

  author: string;

  license: string;

  scripts: object;

  dependencies: object;

  devDependencies: object;
}

export interface IUserInfo {
  id: string,
  nickname: string,
  avatar: string,
  email: string,
  createdAt: string,
  updatedAt: string
}

export interface IPlatformDetail {
  userId: string;
  id: string;
  token: string;
  type: string;
  refreshToken: string;
  createdAt: string;
  updatedAt: string;
}
export interface IRepositoryBranchesRequest {
  repository: string;
}

export interface IRepositoryListRequest {
  platform: string;
}

export interface IRepositoryProjectInfoResponse {
  repository: string;
  branch: string;
  templateId: string;
}

export interface ITaskChildDeleteRequest {
  id: string;
}
export interface ITaskChildDetailRequest {
  id: string;
}
export interface ITaskByIdRequest {
  id: string;
}
export interface ILogRequest {
  id: string;
  task: string;
}

export const commonCode = (data: ICommonGetCodeRequest) => http.post<void, void>('/common/code', data)

export const login = (data: ILoginRequest) => http.post<unknown, ILoginResponse>('/login', data)

export const oauthBind = (data: IOauthBindRequest) => http.post<unknown, IPlatformDetail>('/oauth/bind', data)

export const platformList = () => http.get<unknown, IListResponse<IPlatformDetail>>('/platform/list')

export const repositoryBranches = (data: IRepositoryBranchesRequest) => http.get<unknown, IListResponse<IRepositoryBranche>>('/repository/branches', {
  params: data
})

export const repositoryList = (data: IRepositoryListRequest) => http.get<unknown, IListResponse<IRepositoryItem>>('/repository/list', {
  params: data
})

export const repositoryProjectInfo = (data: IRepositoryProjectInfo) => http.get<unknown, IRepositoryProjectInfo>('/repository/project/info', {
  params: data
})

export const taskChange = (data: ITaskChangeStatusRequest) => http.post<unknown, void>('/task/change', data)

export const taskChildDelete = (data: ITaskChildDeleteRequest) => http.delete<unknown, void>('/task/child/delete', {
  params: data
})

export const taskChildDetail = (data: ITaskChildDetailRequest) => http.get<unknown, IChildTaskDetail>('/task/child/detail', {
  params: data
})

export const taskChildList = (data: IChildTaskListRequest) => http.post<unknown, IListResponse<IChildTaskDetail>>('/task/child/list', data)

export const taskCreate = (data: ITaskDetail) => http.post<unknown, { id: string }>('/task/create', data)

export const taskDelete = (data: ITaskByIdRequest) => http.delete<unknown, { id: string }>('/task/delete', {
  params: data
})

export const taskDetail = (data: ITaskByIdRequest) => http.get<unknown, ITaskDetail>('/task/detail', {
  params: data
})

export const taskList = (data: ITaskListRequest) => http.post<unknown, IListResponse<ITaskDetail>>('/task/list', data)

export const taskLog = (data: ILogRequest) => http.get<unknown, ILogResponse>('/task/log', {
  params: data
})

export const templateList = () => http.get<unknown, IListResponse<ITemplate>>('/template/list')

export const userInfo = () => http.get<unknown, IUserInfo>('/user/info')