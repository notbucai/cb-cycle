import { Controller } from 'egg';

export default class CommonController extends Controller {
  // 获取验证码
  public async code () {
    const { ctx } = this;
    const { email } = ctx.request.body;
    this.ctx.validate({
      email: {
        type: 'email',
        required: true,
      }
    }, ctx.request.body);
    // email
    const code = await ctx.service.common.genCode(email);
    const sendStatus = await this.ctx.service.email.sendCode(email, code);
    return {
      result: sendStatus
    };
  }
}
