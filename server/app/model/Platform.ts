import { Application } from 'egg';

export default (app: Application) => {
  const DataTypes = app.Sequelize;

  const User = app.model.define('platform', {
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    type: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: '1. github\n2. gitee'
    },
    user_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    refresh_token: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'platform',
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
      {
        name: 'type_and_user_id_01',
        using: 'BTREE',
        fields: [
          { name: 'type' },
          { name: 'user_id' },
        ]
      },
      {
        name: 'platform_id_on_user_id01',
        using: 'BTREE',
        fields: [
          { name: 'user_id' },
        ]
      },
    ]
  });

  return User;
};
