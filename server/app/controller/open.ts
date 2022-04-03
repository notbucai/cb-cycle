import { Controller } from 'egg';
import { TaskStatus } from '../constant/status';
import { IPushPayload } from '../types/base';

export default class OpenController extends Controller {
  /**
   * 提供托管平台webhook回调
   * POST /open/callback/run
   * 接口ID：14952019
   * 接口地址：https://www.apifox.cn/web/project/741496/apis/api-14952019
   */
  public async run () {
    const { ctx, app } = this;
    const { id } = ctx.params;
    // console.log('id', id, ctx.query, ctx.request.body);
    const body = ctx.request.body as IPushPayload;
    this.logger.info(body);
    const taskModel = await app.model.Task.findByPk(id);
    if (!taskModel) {
      return {
        message: '任务不存在'
      };
    }
    if (taskModel.status as TaskStatus !== TaskStatus.ING) {
      return {
        message: '当前状态不是进行中'
      };
    }
    // 判断是否属于当前任务的push
    if (body.ref !== `refs/heads/${taskModel.branch as string}`) {
      return {
        message: '触发的非当前任务'
      };
    }

    return ctx.service.task.run(taskModel, body.head_commit.author);
  }
}
