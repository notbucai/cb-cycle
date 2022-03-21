// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTask from '../../../app/controller/task';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    task: ExportTask;
    user: ExportUser;
  }
}
