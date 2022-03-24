import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.prefix('/api/v1');
  router.post('/login', controller.user.login);
  router.get('/user/info', controller.user.info);

  router.post('/common/code', controller.common.code);
  router.post('/task/list', controller.task.list);
};
