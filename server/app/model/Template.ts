import { Application } from 'egg';
import { Template } from '../../models/Template';

export default (app: Application) => {
  const ModelCtor = Template.initModel(app.model);

  return ModelCtor;
};
