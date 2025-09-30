import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/realtor/layouts/AppLayout.vue'
import AuthLayout from '@/realtor/layouts/AuthLayout.vue'

const realtorRoutes: Array<RouteRecordRaw> =  [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'realtor.dashboard' },
  },
  {
    path: '/realtor',
    name: 'realtor',
    component: AppLayout,
    redirect: {name: 'realtor.dashboard'},
    children: [
      {
        name: 'realtor.dashboard',
        path: '/realtor/dashboard',
        component: () => import('@/realtor/views/dashboard/Dashboard.vue')
      },
      {
        name: 'realtor.auth',
        path: '/realtor/auth',
        component: AuthLayout,
        children: [
          {
            path: '/realtor/auth/login',
            name: 'realtor.login',
            component: () => import('@/realtor/views/auth/Login.vue'),
          },
          {
            path: '/realtor/auth/signup',
            name: 'realtor.signup',
            component: () => import('@/realtor/views/auth/Signup.vue'),
          }
        ]
      }
    ]
  },
]

export default realtorRoutes