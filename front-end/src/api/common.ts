import { ChildTaskStatus, TaskStatus } from '../constants/status';
import http from '../plugin/http';

export interface IOauthBindRequest {
  code: string;
  type: string;
}


export interface TaskListCreateTimeRange {
  start: string;
  ent: string;
}

export interface ITaskListRequest {

  pageIndex?: number;

  pageSize?: number;

  ids?: string[];

  taskName?: string;

  createTimeRange?: TaskListCreateTimeRange;

  status?: Array<number>;

  repository?: Array<string>;
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

  isRun: number;

  isStructure: number;

  isBuild: number;
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

  status?: TaskStatus;

  id?: string;

  activeId?: string;
  owner?: string;

  template?: ITemplate;

  platform?: IPlatformDetail;

  user?: IUserInfo;

  child?: IChildTaskDetail;

  domain?: string;

  routerMode?: string;

  externalPort?: string;
}

export interface IRepositoryItem {

  name?: string;

  id?: string;

  nodeId?: string;

  fork?: boolean;

  owner?: {
    login?: string
  }

  full_name?: string

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

  status: ChildTaskStatus;
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
  id: string;
  type: string;
  rUser: string;
  createdAt: string;
  updatedAt: string;
  platformConfig?: IPlatformConfigDetail,
}

export interface IPlatformConfigDetail {
  id: string;
  type: string;
  icon?: string;
  refreshToken: string;
  createdAt: string;
  updatedAt: string;
  platform?: IPlatformDetail,
}
export interface IRepositoryBranchesRequest {
  repository: string;
  owner: string;
  platform: string;
}

export interface IRepositoryInfoRequest {
  repository: string;
  owner: string;
  platform: string;
  branch: string;
}

export interface IRepositoryListRequest {
  platform: string;
  keywords: string;
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
  type: string;
}

export const commonCode = (data: ICommonGetCodeRequest) => http.post<void, void>('/common/code', data)

export const login = (data: ILoginRequest) => http.post<unknown, ILoginResponse>('/login', data)

export const oauthBind = (data: IOauthBindRequest) => http.post<unknown, IPlatformConfigDetail>('/oauth/bind', data)

export const platformList = () => http.get<unknown, IListResponse<IPlatformConfigDetail>>('/platform/list')

export const repositoryBranches = (data: IRepositoryBranchesRequest) => http.get<unknown, IListResponse<IRepositoryBranche>>('/repository/branches', {
  params: data
})

export const repositoryList = (data: IRepositoryListRequest) => http.get<unknown, IListResponse<IRepositoryItem>>('/repository/list', {
  params: data
})

export const repositoryProjectInfo = (data: IRepositoryInfoRequest) => http.get<unknown, IRepositoryProjectInfo>('/repository/project/info', {
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

export const taskCreate = (data: ITaskDetail) => http.post<unknown, { model: { id: string } }>('/task/create', data)

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