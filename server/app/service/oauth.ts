import { Service } from 'egg';
import { Op } from 'sequelize';
import ResponseConstant from '../constant/response';
import { HttpException } from '../exception/HttpException';

interface IGitHubAccessResponse {
  error?: string;
  error_description?: string;
  token_type?: string;
  scope?: string;
  access_token?: string;
}

interface IGithubUserInfoResponse {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string
  company: any
  blog: string
  location: string
  email: string
  hireable: boolean
  bio: string
  twitter_username: any
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export default class OAuth extends Service {
  async bind (type: string, code: string, userId: string) {
    const { app } = this;
    const pConfigModel = await app.model.PlatformConfig.findOne({
      type
    });
    this.logger.info({
      type, code, userId,
      pc_id: pConfigModel?.id,
    });
    if (!pConfigModel?.loginUrl) throw new HttpException(ResponseConstant.FAIL.CODE);
    const reqData = {
      code,
      client_id: pConfigModel.clientId,
      client_secret: pConfigModel.secret
    };
    this.logger.info(reqData);
    // 通过code交换token
    const reuslt = await app.httpclient.request<IGitHubAccessResponse>(pConfigModel?.loginUrl || '', {
      method: 'POST',
      data: reqData,
      dataType: 'json',
      contentType: 'json',
    });
    const data = reuslt.data;
    // 获取用户信息
    const userinfoResult = await app.httpclient.curl<IGithubUserInfoResponse>(pConfigModel?.userinfoUrl || '', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${data?.access_token}`
      },
      dataType: 'json',
      contentType: 'json',
    });
    const userinfo = userinfoResult.data;
    this.logger.info({ userinfo });
    if (reuslt.status !== 200) {
      this.logger.error(reuslt);
      throw new HttpException(ResponseConstant.OAUTH_FAIL.CODE, JSON.stringify(data));
    }
    if (data.error) {
      this.logger.error(data);
      throw new HttpException(ResponseConstant.OAUTH_FAIL.CODE, data.error_description || data.error);
    }
    this.logger.info(data);
    // 获取类型所对应的配置模版
    const configModel = await app.model.PlatformConfig.findOne({
      type
    });
    if (!configModel?.id) throw new HttpException(ResponseConstant.FAIL.CODE);
    // 写库
    const [model, isCreated] = await app.model.Platform.findOrCreate({
      where: {
        [Op.and]: {
          user_id: userId,
          platformConfigId: configModel.id,
        },
      },
      defaults: {
        scope: data.scope,
        token: data.access_token || '',
        tokenType: data.token_type,
        userId,
        rUser: userinfo.login,
        platformConfigId: configModel?.id
      } as any
    });
    if (!isCreated) {
      // update
      await model.update({
        token: data.access_token,
        scope: data.scope,
        tokenType: data.token_type,
      });
    }
    return model;
  }
}
