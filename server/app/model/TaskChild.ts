import { Application } from 'egg';

export default (app: Application) => {
  const DataTypes = app.Sequelize;

  const User = app.model.define('task_child', {
    id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    build_log: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '日志存放位置'
    },
    deploy_log: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '日志存放位置'
    },
    task_id: {
      type: DataTypes.STRING(32),
      allowNull: true,
      references: {
        model: 'task',
        key: 'id'
      }
    },
    build_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deploy_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
      {
        name: 'task_id_task_child_id_on',
        using: 'BTREE',
        fields: [
          { name: 'task_id' },
        ]
      },
    ]
  });

  return User;
};
