import { Application } from 'egg';
import { Platform } from '../../models/Platform';

export default (app: Application) => {
  const ModelCtor = Platform.initModel(app.model);

  (ModelCtor as any).associate = () => {
    app.model.Platform.belongsTo(app.model.PlatformConfig, { as: 'platformConfig', foreignKey: 'platformConfigId' });
  };
  return ModelCtor;
};
