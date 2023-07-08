import { createRouter, createWebHistory } from 'vue-router';

const MainPage = () => import('@/pages/MainPage');
const RegistrationPage = () => import('@/pages/RegistrationPage');
const LoginPage = () => import('@/pages/LoginPage');
const UserPage = () => import('@/pages/UserPage');

const routerHistory = createWebHistory(process.env.BASE_URL);

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' },
    },
    {
      path: '/',
      name: 'home',
      component: MainPage,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/registration',
      name: 'registration',
      component: RegistrationPage,
    },
    {
      path: '/user',
      name: 'user',
      component: UserPage,
    },
  ],
});
export default router;
