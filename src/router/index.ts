import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import realtorRoutes from '@/realtor/router'

const routes = [
  ...realtorRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (!authStore.checkAuth) {
    authStore.restoreAuthData()
  }

  authStore.checkTokenExpiry() // check token expiry

  if (to.meta.requireAuth && !authStore.checkAuth) {
    return next('/realtor/auth/login')
  }

  if (to.meta.guest && authStore.checkAuth) {
    return next('/realtor/dashboard')
  }

  next()
})

export default router