import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Task, TaskId } from './Task';

export interface TaskChildAttributes {
  id: string;
  status?: number;
  runLog?: string;
  initLog?: string;
  buildLog?: string;
  deployLog?: string;
  taskId?: string;
  buildAt?: Date;
  deployAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  commitEmail?: string;
  version?: string;
  buildPid?: number;
  runPid?: number;
  copyPid?: number;
  bindPid?: number;
}

export type TaskChildPk = 'id';
export type TaskChildId = TaskChild[TaskChildPk];
export type TaskChildOptionalAttributes = 'id' | 'status' | 'initLog' | 'runLog' | 'buildLog' | 'deployLog' | 'taskId' | 'buildAt' | 'deployAt' | 'createdAt' | 'updatedAt' | 'commitEmail' | 'version' | 'buildPid' | 'runPid' | 'copyPid' | 'bindPid';
export type TaskChildCreationAttributes = Optional<TaskChildAttributes, TaskChildOptionalAttributes>;

export class TaskChild extends Model<TaskChildAttributes, TaskChildCreationAttributes> implements TaskChildAttributes {
  id!: string;
  status?: number;
  buildLog?: string;
  deployLog?: string;
  runLog?: string;
  initLog?: string;
  taskId?: string;
  buildAt?: Date;
  deployAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  commitEmail?: string;
  version?: string;
  buildPid?: number;
  runPid?: number;
  copyPid?: number;
  bindPid?: number;

  // TaskChild belongsTo Task via taskId
  task!: Task;
  getTask!: Sequelize.BelongsToGetAssociationMixin<Task>;
  setTask!: Sequelize.BelongsToSetAssociationMixin<Task, TaskId>;
  createTask!: Sequelize.BelongsToCreateAssociationMixin<Task>;

  static initModel(sequelize: Sequelize.Sequelize): typeof TaskChild {
    return sequelize.define('TaskChild', {
      id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      status: {
        type: DataTypes.INTEGER(),
        allowNull: true
      },
      initLog: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '日志存放位置',
        field: 'init_log'
      },
      runLog: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '日志存放位置',
        field: 'run_log'
      },
      buildLog: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '日志存放位置',
        field: 'build_log'
      },
      deployLog: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '日志存放位置',
        field: 'deploy_log'
      },
      taskId: {
        type: DataTypes.STRING(36),
        allowNull: true,
        references: {
          model: 'task',
          key: 'id'
        },
        field: 'task_id'
      },
      buildAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'build_at'
      },
      deployAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deploy_at'
      },
      commitEmail: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'commit_email'
      },
      version: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      buildPid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '进程pid',
        field: 'build_pid'
      },
      runPid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '进程pid',
        field: 'run_pid'
      },
      copyPid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '进程pid',
        field: 'copy_pid'
      },
      bindPid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '进程pid',
        field: 'bind_pid'
      }
    }, {
      tableName: 'task_child',
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
    }) as typeof TaskChild;
  }
}
