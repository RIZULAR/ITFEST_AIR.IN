import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import FieldsPage from '../views/FieldsPage.vue'
import WaterAllocationPage from '../views/WaterAllocationPage.vue'
import SchedulePage from '../views/SchedulePage.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
  },
  {
    path: '/fields',
    name: 'Fields',
    component: FieldsPage,
  },
  {
    path: '/allocation',
    name: 'WaterAllocation',
    component: WaterAllocationPage,
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: SchedulePage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
