import { Service } from 'egg';
import * as util from 'util';
import { HttpException } from '../exception/HttpException';
import responseConstant from '../constant/response';

/**
 * Common Service
 */
export default class Common extends Service {

  private static readonly CODE_KEY = 'CODE::%s';

  getCodeKey (email: string) {
    return util.format(Common.CODE_KEY, email);
  }

  async genCode (email: string) {
    const code = Math.random().toString().slice(-6)
      .toString();
    const key = this.getCodeKey(email);
    // 判断是否超过一分钟
    const cacheCode: { code: string; createAt: number; } | undefined = await this.ctx.service.redis.get(key);

    if (cacheCode) {
      if (Date.now() - cacheCode.createAt < 60 * 1000) {
        throw new HttpException(responseConstant.CODE_VALID_FAIL.CODE);
      }
    }
    await this.ctx.service.redis.set(key, {
      code,
      createAt: Date.now()
    }, 60 * 15);
    return code;
  }

  async verifyCode (email: string, code: string) {
    const key = this.getCodeKey(email);
    const cacheCode: { code: string; createAt: number; } = await this.ctx.service.redis.get(key);
    return cacheCode && cacheCode?.code === code;
  }

  async delCode (email: string) {
    const key = this.getCodeKey(email);
    return this.ctx.service.redis.del(key);
  }

  async genToken (userId: string) {
    const token = this.app.jwt.sign({ id: userId }, this.config.jwt.secret);
    return token;
  }

  async currentUser () {
    const token = this.ctx.headers.authorization as string;
    const data = this.app.jwt.decode(token.replace('Bearer ', '')) as unknown as { id: string, iat: number };
    const user = await this.app.model.User.findByPk(data.id);

    return user;
  }
}

