// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportResponseHandler from '../../../app/middleware/responseHandler';

declare module 'egg' {
  interface IMiddleware {
    responseHandler: typeof ExportResponseHandler;
  }
}
