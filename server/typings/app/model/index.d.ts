// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportPlatform from '../../../app/model/Platform';
import ExportPlatformConfig from '../../../app/model/PlatformConfig';
import ExportTask from '../../../app/model/Task';
import ExportTaskChild from '../../../app/model/TaskChild';
import ExportTemplate from '../../../app/model/Template';
import ExportUser from '../../../app/model/User';

declare module 'egg' {
  interface IModel {
    Platform: ReturnType<typeof ExportPlatform>;
    PlatformConfig: ReturnType<typeof ExportPlatformConfig>;
    Task: ReturnType<typeof ExportTask>;
    TaskChild: ReturnType<typeof ExportTaskChild>;
    Template: ReturnType<typeof ExportTemplate>;
    User: ReturnType<typeof ExportUser>;
  }
}
