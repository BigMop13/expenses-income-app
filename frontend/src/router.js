import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './components/LoginPage.vue';
import Dashboard from './views/Dashboard.vue';
import Budget from './views/Budget.vue';
import Report from './views/Report.vue';

const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/budget', name: 'Budget', component: Budget },
  { path: '/report', name: 'Report', component: Report },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router; 