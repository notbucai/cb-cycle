// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCommon from '../../../app/controller/common';
import ExportOauth from '../../../app/controller/oauth';
import ExportOpen from '../../../app/controller/open';
import ExportPlatform from '../../../app/controller/platform';
import ExportRepository from '../../../app/controller/repository';
import ExportTask from '../../../app/controller/task';
import ExportTemplate from '../../../app/controller/template';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    common: ExportCommon;
    oauth: ExportOauth;
    open: ExportOpen;
    platform: ExportPlatform;
    repository: ExportRepository;
    task: ExportTask;
    template: ExportTemplate;
    user: ExportUser;
  }
}
