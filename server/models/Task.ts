import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { TaskChild, TaskChildId } from './TaskChild';

export interface TaskAttributes {
  id: string;
  userId: string;
  platformId: string;
  templateId?: string;
  taskName: string;
  status?: string;
  owner?: string;
  repository: string;
  branch: string;
  runScript?: string;
  buildScript?: string;
  buildPath?: string;
  serverPort?: number;
  externalPort?: number;
  domain?: string;
  ip?: string;
  routerMode?: string;
  runLog?: string;
  activeId?: string;
  child?: TaskChild;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TaskPk = 'id';
export type TaskId = Task[TaskPk];
export type TaskOptionalAttributes = 'id' | 'child' | 'templateId' | 'externalPort' | 'status' | 'owner' | 'runScript' | 'buildScript' | 'buildPath' | 'serverPort' | 'domain' | 'ip' | 'routerMode' | 'runLog' | 'activeId' | 'createdAt' | 'updatedAt';
export type TaskCreationAttributes = Optional<TaskAttributes, TaskOptionalAttributes>;

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  id!: string;
  userId!: string;
  platformId!: string;
  templateId?: string;
  taskName!: string;
  status?: string;
  owner?: string;
  repository!: string;
  branch!: string;
  runScript?: string;
  buildScript?: string;
  buildPath?: string;
  serverPort?: number;
  externalPort?: number;
  domain?: string;
  ip?: string;
  routerMode?: string;
  runLog?: string;
  activeId?: string;
  child?: TaskChild;
  createdAt?: Date;
  updatedAt?: Date;

  // Task hasMany TaskChild via taskId
  taskChildren!: TaskChild[];
  getTaskChildren!: Sequelize.HasManyGetAssociationsMixin<TaskChild>;
  setTaskChildren!: Sequelize.HasManySetAssociationsMixin<TaskChild, TaskChildId>;
  addTaskChild!: Sequelize.HasManyAddAssociationMixin<TaskChild, TaskChildId>;
  addTaskChildren!: Sequelize.HasManyAddAssociationsMixin<TaskChild, TaskChildId>;
  createTaskChild!: Sequelize.HasManyCreateAssociationMixin<TaskChild>;
  removeTaskChild!: Sequelize.HasManyRemoveAssociationMixin<TaskChild, TaskChildId>;
  removeTaskChildren!: Sequelize.HasManyRemoveAssociationsMixin<TaskChild, TaskChildId>;
  hasTaskChild!: Sequelize.HasManyHasAssociationMixin<TaskChild, TaskChildId>;
  hasTaskChildren!: Sequelize.HasManyHasAssociationsMixin<TaskChild, TaskChildId>;
  countTaskChildren!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Task {
    return sequelize.define('Task', {
      id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        field: 'user_id'
      },
      platformId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        field: 'platform_id'
      },
      templateId: {
        type: DataTypes.STRING(36),
        allowNull: true,
        field: 'template_id'
      },
      taskName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'task_name'
      },
      status: {
        type: DataTypes.STRING(36),
        allowNull: true,
        comment: '任务状态'
      },
      owner: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      repository: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      branch: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      runScript: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'run_script'
      },
      buildScript: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'build_script'
      },
      buildPath: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'build_path'
      },
      serverPort: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'server_port'
      },
      externalPort: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'external_port'
      },
      domain: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '域名'
      },
      ip: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '容器ip'
      },
      routerMode: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '路由模式，仅在spa项目中有效',
        field: 'router_mode'
      },
      runLog: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '日志存放文件',
        field: 'run_log'
      },
      activeId: {
        type: DataTypes.STRING(36),
        allowNull: true,
        comment: '当前触发的id',
        field: 'active_id'
      }
    }, {
      tableName: 'task',
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
        {
          name: 'active_child_id',
          using: 'BTREE',
          fields: [
            { name: 'active_id' },
          ]
        },
      ]
    }) as typeof Task;
  }
}
