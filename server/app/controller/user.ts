import { Controller } from 'egg';

// import { HttpException } from '../exception/HttpException';

export default class UserController extends Controller {
  public async login () {
    const t = this.app.jwt.sign({ id: '123' }, this.config.jwt.secret);
    return {
      token: t
    };
  }
}
