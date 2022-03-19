import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import store from '../store';
import NProgress from 'nprogress';

export default async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  NProgress.start();
  const _next = (location?: string) => {
    NProgress.done();
    location ? next(location) : next();
  }
  if (to.path.includes('/manage')) {
    // 权限判断
    if (!store.state?.app?.token) {
      return _next('/login')
    }
  }
  _next();
}