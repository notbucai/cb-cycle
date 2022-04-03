import { Controller } from 'egg';

export default class RepoController extends Controller {
  /**
   * 获取仓库列表
   * GET /repository/list
   * 接口ID：14202548
   * 接口地址：https://www.apifox.cn/web/project/741496/apis/api-14202548
   */
  public async list () {
    const { platform, keywords } = this.ctx.query;
    this.ctx.validate({
      platform: 'string',
      keywords: 'string'
    }, this.ctx.query);


    const platformConfigModel = await this.app.model.PlatformConfig.findOne({
      type: platform,
      include: [{
        model: this.app.model.Platform,
        as: 'platform',
        right: true
      }]
    });
    // platform.id
    const pModel = platformConfigModel?.platform;
    const token = pModel?.token;
    const reposUrl = platformConfigModel?.reposUrl;
    console.log('pModel', pModel?.id);

    const url = reposUrl?.replace('${q}', encodeURIComponent(keywords))
      .replace('${u}', encodeURIComponent(pModel?.rUser || '')) || '';
    this.logger.info({
      reposUrl: url,
      token,
    });

    const res = await this.app.httpclient.curl(url, {
      headers: {
        authorization: `Bearer ${token}`
      },
      contentType: 'json',
      dataType: 'json',
      content: 'json'
    });

    this.logger.info(res.data);

    return {
      results: res.data?.items,
      total: res.data?.total_count,
    };
  }
  /**
   * 获取某个仓库的分支
   * GET /repository/branches
   * 接口ID：14204721
   * 接口地址：https://www.apifox.cn/web/project/741496/apis/api-14204721
   */
  public async branches () {
    const { repository, owner, platform } = this.ctx.query;
    this.ctx.validate({
      platform: 'string',
      repository: 'string',
      owner: 'string'
    }, this.ctx.query);

    const platformConfigModel = await this.app.model.PlatformConfig.findOne({
      type: platform,
      include: [{
        model: this.app.model.Platform,
        as: 'platform',
        right: true
      }]
    });
    // platform.id
    const pModel = platformConfigModel?.platform;
    const token = pModel?.token;
    const branchesUrl = platformConfigModel?.branchesUrl;

    const url = branchesUrl?.replace('${o}', encodeURIComponent(owner))
      .replace('${r}', encodeURIComponent(repository)) || '';

    const res = await this.app.httpclient.curl(url, {
      headers: {
        authorization: `Bearer ${token}`
      },
      contentType: 'json',
      dataType: 'json',
      content: 'json'
    });
    console.log(url);

    return {
      results: res.data,
      total: res.data?.length,
    };
  }
  /**
   * 获取项目信息
   * GET /repository/project/info
   * 接口ID：14255479
   * 接口地址：https://www.apifox.cn/web/project/741496/apis/api-14255479
   */
  public async projectInfo () {
    const { repository, owner, platform, branch } = this.ctx.query;
    this.ctx.validate({
      platform: 'string',
      repository: 'string',
      branch: 'string',
      owner: 'string'
    }, this.ctx.query);

    const platformConfigModel = await this.app.model.PlatformConfig.findOne({
      type: platform,
      include: [{
        model: this.app.model.Platform,
        as: 'platform',
        right: true
      }]
    });
    // platform.id
    const pModel = platformConfigModel?.platform;
    const token = pModel?.token;
    const contentsUrl = platformConfigModel?.contentsUrl;

    const url = contentsUrl?.replace('${o}', encodeURIComponent(owner))
      .replace('${r}', encodeURIComponent(repository))
      .replace('${f}', encodeURIComponent('package.json'))
      .replace('${b}', encodeURIComponent(branch)) || '';

    console.log(url);

    const res = await this.app.httpclient.curl(url, {
      headers: {
        authorization: `Bearer ${token}`
      },
      contentType: 'json',
      dataType: 'json',
      content: 'json'
    });
    const content = res.data?.content as string;
    const packageStr = Buffer.from(content, 'base64').toString('utf-8');
    const packageObj = JSON.parse(packageStr);
    return packageObj;
  }
}
