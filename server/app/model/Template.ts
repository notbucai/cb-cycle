import { Application } from 'egg';

export default (app: Application) => {
  const DataTypes = app.Sequelize;

  const User = app.model.define('template', {
    id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(32),
      allowNull: true,
      comment: 'static \/ dynamic'
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '模版文件位置'
    }
  }, {
    timestamps: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'id' },
        ]
      },
    ]
  });

  return User;
};
