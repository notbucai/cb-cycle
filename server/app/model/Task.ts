import { Application } from 'egg';
import { Task } from '../../models/Task';

export default (app: Application) => {
  const ModelCtor = Task.initModel(app.model);

  (ModelCtor as any).associate = () => {
    app.model.Task.hasMany(app.model.TaskChild, { as: 'childs', foreignKey: 'taskId' });
    app.model.Task.belongsTo(app.model.Platform, { as: 'platform', foreignKey: 'platformId' });
    app.model.Task.belongsTo(app.model.User, { as: 'user', foreignKey: 'userId' });
    app.model.Task.belongsTo(app.model.TaskChild, {
      foreignKey: 'activeId',
      as: 'child',
    });
    app.model.Task.belongsTo(app.model.Template, { as: 'template', foreignKey: 'templateId' });
  };
  return ModelCtor;
};
