import { Service } from 'egg';

/**
 * User Service
 */
export default class User extends Service {

  async login (email: string) {
    const res = await this.app.model.User.findOrCreate({
      where: {
        email
      },
      defaults: {
        nickname: email.replace(/@(.*?)$/, '')
      }
    });
    return res[0].get('id') as string;
  }

}
