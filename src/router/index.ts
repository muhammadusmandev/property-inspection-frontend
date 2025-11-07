import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSubscriptionStore } from '@/stores/subscription'
import realtorRoutes from '@/realtor/router'

const routes = [
  ...realtorRoutes,
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
    return next('/realtor/auth/login')
  }

  if (to.meta.guest && authStore.checkAuth) {
    return next('/realtor/dashboard')
  }

  if (to.meta.requiresSubscription) {
    await subscription.getStatus()

    switch (subscription.status) {
      case 'active':
      case 'trial_active':
        return next()
    
      case 'expired':
      case 'cancelled':
        return next('/realtor/dashboard') // Todo: need to redirect to upgrade page
      
      case 'non_subscribe':
        return next('/realtor/billing')

      default:
        return next()
    }
  }

  next()
})

export default router