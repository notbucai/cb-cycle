import { Controller } from 'egg';

export default class OauthController extends Controller {
  /**
   * 绑定托管平台
   */
  public async bind () {
    const { ctx } = this;
    const { code, type } = ctx.request.body;
    const currentUser = await ctx.service.common.currentUser();
    ctx.validate({
      code: 'string',
    });
    return ctx.service.oauth.bind(type, code, currentUser?.id as string);
  }

  /**
   * 取消绑定托管平台
   */
  public async unbind () {
    return {
    };
  }
}
