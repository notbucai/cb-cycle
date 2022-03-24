import { Controller } from 'egg';
import ResponseConstant from '../constant/response';
import { HttpException } from '../exception/HttpException';

export default class UserController extends Controller {
  public async login () {
    const { ctx } = this;
    ctx.validate({
      email: 'email',
      code: 'string'
    });
    const { email, code } = ctx.request.body;
    const v = await ctx.service.common.verifyCode(email, code);
    if (!v) {
      throw new HttpException(ResponseConstant.CODE_FAIL.CODE);
    }
    // 销毁
    await ctx.service.common.delCode(email);
    const userId = await ctx.service.user.login(email);
    const token = await ctx.service.common.genToken(userId);

    return {
      token
    };
  }

  public async info () {
    const { ctx } = this;
    const user = await ctx.service.common.currentUser();
    return user;
  }
}
