import { Application } from 'egg';
import { PlatformConfig } from '../../models/PlatformConfig';

export default (app: Application) => {
  const ModelCtor = PlatformConfig.initModel(app.model);

  (ModelCtor as any).associate = () => {
    app.model.PlatformConfig.hasOne(app.model.Platform, { as: 'platform', foreignKey: 'platformConfigId' });
  };
  return ModelCtor;
};
