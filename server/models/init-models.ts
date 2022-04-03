import type { Sequelize } from 'sequelize';
import { Platform as _Platform } from './Platform';
import type { PlatformAttributes, PlatformCreationAttributes } from './Platform';
import { PlatformConfig as _PlatformConfig } from './PlatformConfig';
import type { PlatformConfigAttributes, PlatformConfigCreationAttributes } from './PlatformConfig';
import { Task as _Task } from './Task';
import type { TaskAttributes, TaskCreationAttributes } from './Task';
import { TaskChild as _TaskChild } from './TaskChild';
import type { TaskChildAttributes, TaskChildCreationAttributes } from './TaskChild';
import { Template as _Template } from './Template';
import type { TemplateAttributes, TemplateCreationAttributes } from './Template';
import { User as _User } from './User';
import type { UserAttributes, UserCreationAttributes } from './User';

export {
  _Platform as Platform,
  _PlatformConfig as PlatformConfig,
  _Task as Task,
  _TaskChild as TaskChild,
  _Template as Template,
  _User as User,
};

export type {
  PlatformAttributes,
  PlatformCreationAttributes,
  PlatformConfigAttributes,
  PlatformConfigCreationAttributes,
  TaskAttributes,
  TaskCreationAttributes,
  TaskChildAttributes,
  TaskChildCreationAttributes,
  TemplateAttributes,
  TemplateCreationAttributes,
  UserAttributes,
  UserCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Platform = _Platform.initModel(sequelize);
  const PlatformConfig = _PlatformConfig.initModel(sequelize);
  const Task = _Task.initModel(sequelize);
  const TaskChild = _TaskChild.initModel(sequelize);
  const Template = _Template.initModel(sequelize);
  const User = _User.initModel(sequelize);

  TaskChild.belongsTo(Task, { as: 'task', foreignKey: 'taskId' });
  Task.hasMany(TaskChild, { as: 'taskChildren', foreignKey: 'taskId' });

  return {
    Platform,
    PlatformConfig,
    Task,
    TaskChild,
    Template,
    User,
  };
}
