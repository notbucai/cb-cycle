import * as VueRouter from 'vue-router';

import authorize from './authorize';

import DefaultLayout from '../layout/Default.vue';

import InitPage from '../pages/InitPage.vue';
import BindPage from '../pages/oauth/BindPage.vue';
import RegisterPage from '../pages/auth/RegisterPage.vue';
import LoginPage from '../pages/auth/LoginPage.vue';

import IndexPage from '../pages/manage/IndexPage.vue';
import TaskCreatePage from '../pages/manage/task/TaskCreatePage.vue';
import TaskDetailPage from '../pages/manage/task/TaskDetailPage.vue';
import TaskListPage from '../pages/manage/task/TaskListPage.vue';
import PlatformList from '../pages/manage/platform/PlatformList.vue';

const routes: VueRouter.RouteRecordRaw[] = [
  {
    path: '/manage',
    component: DefaultLayout,
    redirect: '/manage/dashboard',
    children: [
      {
        path: 'dashboard',
        component: IndexPage
      },
      {
        path: 'task/list',
        component: TaskListPage
      },
      {
        path: 'task/create',
        component: TaskCreatePage
      },
      {
        path: 'task/detail/:id',
        component: TaskDetailPage,
      },
      {
        path: 'platform/list',
        component: PlatformList
      }
    ]
  },
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '/oauth2/bind/:type',
    component: BindPage,
  },
  {
    path: '/register',
    component: RegisterPage,
  },
  {
    path: '/',
    component: InitPage,
  },
];

const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createWebHistory(),
  routes, // `routes: routes` 的缩写
})

router.beforeEach(authorize);

export default router;