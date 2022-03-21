import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.prefix('/api/v1');
  router.post('/login', controller.user.login);
  router.post('/task/list', controller.task.list);
};
