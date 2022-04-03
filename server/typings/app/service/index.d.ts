// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportCommon from '../../../app/service/common';
import ExportEmail from '../../../app/service/email';
import ExportOauth from '../../../app/service/oauth';
import ExportPlatform from '../../../app/service/platform';
import ExportRedis from '../../../app/service/redis';
import ExportTask from '../../../app/service/task';
import ExportUser from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    common: AutoInstanceType<typeof ExportCommon>;
    email: AutoInstanceType<typeof ExportEmail>;
    oauth: AutoInstanceType<typeof ExportOauth>;
    platform: AutoInstanceType<typeof ExportPlatform>;
    redis: AutoInstanceType<typeof ExportRedis>;
    task: AutoInstanceType<typeof ExportTask>;
    user: AutoInstanceType<typeof ExportUser>;
  }
}
