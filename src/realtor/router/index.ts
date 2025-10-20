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
    name: 'home',
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
      },
      {
        name: 'realtor.properties',
        path: '/realtor/properties',
        children: [
          {
            path: '/realtor/properties/add_property',
            name: 'realtor.properties.add',
            component: () => import('@/realtor/views/properties/AddProperty.vue'),
          },
          {
            path: '/realtor/properties/list',
            name: 'realtor.properties.list',
            component: () => import('@/realtor/views/properties/List.vue'),
          }
        ]
      },
    ]
  },
]

export default realtorRoutes