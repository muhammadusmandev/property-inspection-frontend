import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSubscriptionStore } from '@/stores/subscription'
import inspectorRoutes from '@/inspector/router'

const routes = [
  ...inspectorRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const subscription = useSubscriptionStore()
  
  if (!authStore.checkAuth) {
    authStore.restoreAuthData()
  }

  authStore.checkTokenExpiry() // check token expiry

  if (to.meta.requireAuth && !authStore.checkAuth) {
    return next('/inspector/auth/login')
  }

  if (to.meta.guest && authStore.checkAuth && !to.meta.allowIfAuth) {
    return next('/inspector/dashboard')
  }

  if (to.meta.requiresSubscription) {
    await subscription.getStatus()

    switch (subscription.status) {
      case 'active':
      case 'trial_active':
        return next()
    
      case 'expired':
      case 'cancelled':
        return next('/inspector/dashboard') // Todo: need to redirect to upgrade page
      
      case 'non_subscribe':
        return next('/inspector/billing')

      default:
        return next()
    }
  }

  next()
})

export default router