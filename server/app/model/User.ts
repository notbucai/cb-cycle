import { Application } from 'egg';

const initModel = (app: Application) => {
  const DataTypes = app.Sequelize;

  const User = app.model.define('user', {
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    nickname: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: '昵称'
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '密码'
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '头像'
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: '邮箱',
      unique: 'email_uniqe'
    }
  }, {
    timestamps: true,
    tableName: 'user',
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
        name: 'email_uniqe',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'email' },
        ]
      },
    ]
  });

  return User;
};

export default initModel;
