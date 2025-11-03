import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/realtor/layouts/AppLayout.vue'
import AuthLayout from '@/realtor/layouts/AuthLayout.vue'

const realtorRoutes: Array<RouteRecordRaw> =  [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'realtor.dashboard' },
    meta: { requireAuth: true },
  },
  {
    name: 'realtor.auth',
    path: '/realtor/auth',
    component: AuthLayout,
    meta: { guest: true },
    children: [
      {
        path: '/realtor/auth/login',
        name: 'realtor.login',
        component: () => import('@/realtor/views/auth/Login.vue'),
      },
      {
        path: '/realtor/auth/register',
        name: 'realtor.register',
        component: () => import('@/realtor/views/auth/Register.vue'),
      }
    ]
  },
  {
    path: '/realtor',
    name: 'home',
    component: AppLayout,
    redirect: {name: 'realtor.dashboard'},
    meta: { requireAuth: true },
    children: [
      {
        name: 'realtor.dashboard',
        path: '/realtor/dashboard',
        component: () => import('@/realtor/views/dashboard/Dashboard.vue')
      },
      {
        name: 'realtor.reports',
        path: '/realtor/reports',
        redirect: {name: 'realtor.reports.list'},
        children: [
          {
            path: '/realtor/reports/list',
            name: 'realtor.reports.list',
            component: () => import('@/realtor/views/reports/ListReports.vue'),
          }
        ]
      },
      {
        name: 'realtor.properties',
        path: '/realtor/properties',
        redirect: {name: 'realtor.properties.list'},
        children: [
          {
            path: '/realtor/properties/add_property',
            name: 'realtor.properties.add',
            component: () => import('@/realtor/views/properties/AddProperty.vue'),
          },
          {
            path: '/realtor/properties/property/:id',
            name: 'realtor.properties.update',
            component: () => import('@/realtor/views/properties/UpdateProperty.vue'),
          },
          {
            path: '/realtor/properties/list',
            name: 'realtor.properties.list',
            component: () => import('@/realtor/views/properties/ListProperties.vue'),
          }
        ]
      },
      {
        name: 'realtor.branches',
        path: '/realtor/branches',
        redirect: {name: 'realtor.branches.list'},
        children: [
          {
            path: '/realtor/branches/add_branch',
            name: 'realtor.branches.add',
            component: () => import('@/realtor/views/branches/AddBranch.vue'),
          },
          {
            path: '/realtor/branches/branch/:id',
            name: 'realtor.branches.update',
            component: () => import('@/realtor/views/branches/UpdateBranch.vue'),
          },
          {
            path: '/realtor/branches/list',
            name: 'realtor.branches.list',
            component: () => import('@/realtor/views/branches/ListBranches.vue'),
          }
        ]
      },
      {
        name: 'realtor.clients',
        path: '/realtor/clients',
        redirect: {name: 'realtor.clients.list'},
        children: [
          {
            path: '/realtor/clients/add_client',
            name: 'realtor.clients.add',
            component: () => import('@/realtor/views/clients/AddClient.vue'),
          },
          {
            path: '/realtor/clients/client/:id',
            name: 'realtor.clients.update',
            component: () => import('@/realtor/views/clients/UpdateClient.vue'),
          },
          {
            path: '/realtor/clients/list',
            name: 'realtor.clients.list',
            component: () => import('@/realtor/views/clients/ListClients.vue'),
          },
          {
            path: '/realtor/clients/properties/list/:id',
            name: 'realtor.clients.properties.list',
            component: () => import('@/realtor/views/clients/ListProperties.vue'),
          }
        ]
      },
      {
        name: 'realtor.inspection_areas',
        path: '/realtor/inspection_areas',
        redirect: {name: 'realtor.inspection_areas.list'},
        children: [
          {
            path: '/realtor/inspection_areas/list',
            name: 'realtor.inspection_areas.list',
            component: () => import('@/realtor/views/inspection_areas/ListInspectionAreas.vue'),
          }
        ]
      },
      {
        name: 'realtor.templates',
        path: '/realtor/templates',
        redirect: {name: 'realtor.templates.list'},
        children: [
          {
            path: '/realtor/templates/list',
            name: 'realtor.templates.list',
            component: () => import('@/realtor/views/templates/ListTemplates.vue'),
          }
        ]
      },
    ]
  },
]

export default realtorRoutes