import { Controller } from 'egg';

export default class CommonController extends Controller {
  /**
   * 获取仓库列表
   * GET /repository/list
   * 接口ID：14202548
   * 接口地址：https://www.apifox.cn/web/project/741496/apis/api-14202548
   */
  public async list () {
    return {
    };
  }
  /**
   * 获取某个仓库的分支
   * GET /repository/branches
   * 接口ID：14204721
   * 接口地址：https://www.apifox.cn/web/project/741496/apis/api-14204721
   */
  public async branches () {
    return {
    };
  }
  /**
   * 获取项目信息
   * GET /repository/project/info
   * 接口ID：14255479
   * 接口地址：https://www.apifox.cn/web/project/741496/apis/api-14255479
   */
  public async projectInfo () {
    return {
    };
  }
}
