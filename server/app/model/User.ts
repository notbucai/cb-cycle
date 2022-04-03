import { Application } from 'egg';
import { User } from '../../models/User';

const initModel = (app: Application) => {
  const userModel = User.initModel(app.model);

  return userModel;
};

export default initModel;
