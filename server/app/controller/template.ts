import { Controller } from 'egg';

export default class CommonController extends Controller {
  /**
   * 获取模版列表
   * GET /template/list
   * 接口ID：14259713
   * 接口地址：https://www.apifox.cn/web/project/741496/apis/api-14259713
   */
  public async list () {
    const res = await this.app.model.Template.findAndCountAll({
      // attributes: ['id', 'username', 'password'],
      order: [
        ['created_at', 'DESC']
      ],
    });
    return {
      results: res.rows,
      total: res.count
    };
  }
}
