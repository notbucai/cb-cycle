import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.prefix('/api/v1');
  router.post('/login', controller.user.login);
  router.get('/user/info', controller.user.info);

  router.post('/common/code', controller.common.code);
  router.post('/task/list', controller.task.list);
  router.get('/test', controller.task.test);
  router.post('/task/create', controller.task.create);
  router.get('/task/detail', controller.task.detail);
  router.get('/platform/list', controller.platform.list);
  router.get('/template/list', controller.template.list);
  router.get('/repository/list', controller.repository.list);
  router.get('/repository/branches', controller.repository.branches);
  router.get('/repository/project/info', controller.repository.projectInfo);

  router.post('/oauth/bind', controller.oauth.bind);

  router.post('/open/callback/run/:id', controller.open.run);

};
