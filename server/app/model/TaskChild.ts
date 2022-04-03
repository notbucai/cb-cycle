import { Application } from 'egg';
import { TaskChild } from '../../models/TaskChild';

export default (app: Application) => {
  const ModelCtor = TaskChild.initModel(app.model);

  return ModelCtor;
};
