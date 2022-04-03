import { Context } from 'egg';
import responseConstant from '../constant/response';

export const responseErrorPack = (error: any, env?: string, data?: any) => {
  const status = error.status || 500;
  // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
  const errorMessage = status === 500 && env === 'prod'
    ? responseConstant.FAIL.MESSAGE
    : error.message;
  if (error.name === 'UnauthorizedError') {
    return {
      code: responseConstant.UNAUTHORIZED_ERROR.CODE,
      message: errorMessage,
      data,
    };
  }
  return {
    code: (typeof error.code === 'number' ? error.code : error.suatus) ?? responseConstant.FAIL.CODE,
    message: errorMessage,
    data,
  };
};

export default () => {
  return async (ctx: Context, next: () => Promise<any>) => {
    let responseData = {
      code: ctx.status || responseConstant.SUCCEED.CODE,
      message: ctx.message || responseConstant.SUCCEED.MESSAGE,
      data: ctx.body,
    };
    ctx.logger.info({
      url: ctx.url,
      method: ctx.method,
    });

    try {
      const data = await next();
      responseData = {
        code: typeof data !== 'undefined' ? responseConstant.SUCCEED.CODE : ctx.status,
        message: typeof data !== 'undefined' ? responseConstant.SUCCEED.MESSAGE : ctx.message,
        data
      };
    } catch (err) {
      console.log('=---> ', err);
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx);
      responseData = responseErrorPack(err, ctx.app.config.env, ctx.body);
    }

    ctx.status = 200;
    ctx.body = responseData;
  };
};
