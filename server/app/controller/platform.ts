import { Controller } from 'egg';

export default class CommonController extends Controller {
  /**
   * 获取托管平台列表
   * GET /platform/list
   * 接口ID：14259952
   * 接口地址：https://www.apifox.cn/web/project/741496/apis/api-14259952
   */
  public async list () {
    console.log('---->>>');

    const currentUser = await this.service.common.currentUser();
    const configList = await this.app.model.PlatformConfig.findAndCountAll({
      attributes: ['id', 'type', 'icon', 'createdAt', 'updatedAt'],
    });
    this.logger.info({
      f: 'list',
      count: configList.count,
      user: currentUser
    });
    const rowsPromise = configList.rows.map(async item => {
      if (item.id) {
        const itemJson = item.toJSON();
        this.logger.info({
          platformConfigId: item.id,
          userId: currentUser?.id,
          itemJson
        });
        itemJson.platform = (await this.app.model.Platform.findOne({
          where: {
            platformConfigId: item.id,
            userId: currentUser?.id
          }
        })) || undefined;
        return itemJson;
      }
      return item;
    });
    const rows = await Promise.all(rowsPromise);
    return {
      results: rows,
      total: configList.count
    };
  }
}
