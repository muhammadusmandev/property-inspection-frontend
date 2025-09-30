import { createRouter, createWebHistory } from 'vue-router'

import realtorRoutes from '@/realtor/router'

const routes = [
  ...realtorRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router