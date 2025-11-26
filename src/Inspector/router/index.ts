import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/inspector/layouts/AppLayout.vue'
import AuthLayout from '@/inspector/layouts/AuthLayout.vue'

const inspectorRoutes: Array<RouteRecordRaw> =  [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'inspector.dashboard' },
    meta: { requireAuth: true },
  },
  {
    name: 'inspector.auth',
    path: '/inspector/auth',
    component: AuthLayout,
    meta: { guest: true },
    children: [
      {
        path: '/inspector/auth/login',
        name: 'inspector.login',
        component: () => import('@/inspector/views/auth/Login.vue'),
      },
      {
        path: '/inspector/auth/register',
        name: 'inspector.register',
        component: () => import('@/inspector/views/auth/Register.vue'),
      },
      {
        path: '/report-signature/:uuid/:role',
        name: 'report.signature',
        component: () => import('@/inspector/views/reports/ReportSignature.vue'),
        meta: {
          allowIfAuth: true
        }
      }
    ]
  },
  {
    path: '/inspector',
    name: 'home',
    component: AppLayout,
    redirect: {name: 'inspector.dashboard'},
    meta: { requireAuth: true },
    children: [
      {
        name: 'inspector.dashboard',
        path: '/inspector/dashboard',
        component: () => import('@/inspector/views/dashboard/Dashboard.vue')
      },
      {
        name: 'inspector.reports',
        path: '/inspector/reports',
        redirect: {name: 'inspector.reports.list'},
        children: [
          {
            path: '/inspector/reports/report/:id',
            name: 'inspector.reports.view',
            component: () => import('@/inspector/views/reports/ViewReport.vue'),
          },
          {
            path: '/inspector/reports/list',
            name: 'inspector.reports.list',
            component: () => import('@/inspector/views/reports/ListReports.vue'),
          }
        ]
      },
      {
        name: 'inspector.properties',
        path: '/inspector/properties',
        redirect: {name: 'inspector.properties.list'},
        children: [
          {
            path: '/inspector/properties/add_property',
            name: 'inspector.properties.add',
            component: () => import('@/inspector/views/properties/AddProperty.vue'),
          },
          {
            path: '/inspector/properties/property/:id',
            name: 'inspector.properties.update',
            component: () => import('@/inspector/views/properties/UpdateProperty.vue'),
          },
          {
            path: '/inspector/properties/list',
            name: 'inspector.properties.list',
            component: () => import('@/inspector/views/properties/ListProperties.vue'),
          }
        ]
      },
      {
        name: 'inspector.branches',
        path: '/inspector/branches',
        redirect: {name: 'inspector.branches.list'},
        children: [
          {
            path: '/inspector/branches/add_branch',
            name: 'inspector.branches.add',
            component: () => import('@/inspector/views/branches/AddBranch.vue'),
          },
          {
            path: '/inspector/branches/branch/:id',
            name: 'inspector.branches.update',
            component: () => import('@/inspector/views/branches/UpdateBranch.vue'),
          },
          {
            path: '/inspector/branches/list',
            name: 'inspector.branches.list',
            component: () => import('@/inspector/views/branches/ListBranches.vue'),
          }
        ]
      },
      {
        name: 'inspector.clients',
        path: '/inspector/clients',
        redirect: {name: 'inspector.clients.list'},
        children: [
          {
            path: '/inspector/clients/add_client',
            name: 'inspector.clients.add',
            component: () => import('@/inspector/views/clients/AddClient.vue'),
          },
          {
            path: '/inspector/clients/client/:id',
            name: 'inspector.clients.update',
            component: () => import('@/inspector/views/clients/UpdateClient.vue'),
          },
          {
            path: '/inspector/clients/list',
            name: 'inspector.clients.list',
            component: () => import('@/inspector/views/clients/ListClients.vue'),
          },
          {
            path: '/inspector/clients/properties/list/:id',
            name: 'inspector.clients.properties.list',
            component: () => import('@/inspector/views/clients/ListProperties.vue'),
          }
        ]
      },
      {
        name: 'inspector.inspection_areas',
        path: '/inspector/inspection_areas',
        redirect: {name: 'inspector.inspection_areas.list'},
        children: [
          {
            path: '/inspector/inspection_areas/list',
            name: 'inspector.inspection_areas.list',
            component: () => import('@/inspector/views/inspection_areas/ListInspectionAreas.vue'),
          }
        ]
      },
      {
        name: 'inspector.templates',
        path: '/inspector/templates',
        redirect: {name: 'inspector.templates.list'},
        children: [
          {
            path: '/inspector/templates/list',
            name: 'inspector.templates.list',
            component: () => import('@/inspector/views/templates/ListTemplates.vue'),
          }
        ]
      },
      {
        name: 'inspector.settings',
        path: '/inspector/settings',
        component: () => import('@/inspector/views/settings/Settings.vue'),
      },
    ]
  },
  {
    path: '/inspector/billing',
    name: 'inspector.billing',
    component: () => import('@/inspector/views/billing/TrialBilling.vue'),
    meta: { requireAuth: true },
  },
]

export default inspectorRoutes