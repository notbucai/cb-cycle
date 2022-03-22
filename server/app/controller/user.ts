import { Controller } from 'egg';

export default class UserController extends Controller {
  public async login () {
    const t = this.app.jwt.sign({ id: '123' }, this.config.jwt.secret);
    const a = await this.app.redis.get('xxx');
    console.log('redis test -> ', a);
    this.app.redis.set('xxx', '23');
    return {
      token: t,
    };
  }
}
