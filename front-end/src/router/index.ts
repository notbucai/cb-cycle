import * as VueRouter from 'vue-router';

import InitPage from '../pages/InitPage.vue';
import IndexPage from '../pages/IndexPage.vue';
import RegisterPage from '../pages/auth/RegisterPage.vue';
import LoginPage from '../pages/auth/LoginPage.vue';

import DefaultLayout from '../layout/Default.vue';

const routes: VueRouter.RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: DefaultLayout,
    redirect: '/dashboard/home',
    children: [
      {
        path: 'home',
        component: IndexPage
      }
    ]
  },
  {
    path: '/login',
    component: LoginPage,
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
  history: VueRouter.createWebHistory('/cycle/'),
  routes, // `routes: routes` 的缩写
})

export default router;