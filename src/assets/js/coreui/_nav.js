export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer'
  },
  {
    component: 'CNavTitle',
    name: 'Components',
  },
  {
    component: 'CNavGroup',
    name: 'Properties',
    to: '/#',
    icon: 'cil-cursor',
    items: [
      {
        component: 'CNavItem',
        name: 'Add Property',
        to: '/properties/add-property',
      },
      {
        component: 'CNavItem',
        name: 'List Property',
        to: '/properties/list-properties',
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Settings',
    to: '/#',
    icon: 'cil-settings',
    badge: {
      color: 'primary',
      text: 'NEW',
      shape: 'pill',
    },
  },
]
