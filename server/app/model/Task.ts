import { Application } from 'egg';

export default (app: Application) => {
  const DataTypes = app.Sequelize;

  const User = app.model.define('task', {
    id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true
    },
    platform_id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      references: {
        model: 'platform',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    task_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    repository: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    branch: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    run_script: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    build_script: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    build_path: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    server_port: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    template_id: {
      type: DataTypes.STRING(32),
      allowNull: true,
      references: {
        model: 'template',
        key: 'id'
      }
    },
    run_log: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '日志存放文件'
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '任务状态'
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
        name: 'task_id_on_user_id',
        using: 'BTREE',
        fields: [
          { name: 'user_id' },
        ]
      },
      {
        name: 'task_on_platform_id',
        using: 'BTREE',
        fields: [
          { name: 'platform_id' },
        ]
      },
      {
        name: 'template_id_task_id',
        using: 'BTREE',
        fields: [
          { name: 'template_id' },
        ]
      },
    ]
  });

  return User;
};
