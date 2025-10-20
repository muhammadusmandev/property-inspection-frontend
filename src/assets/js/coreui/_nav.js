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
        to: '/realtor/properties/add_property',
      },
      {
        component: 'CNavItem',
        name: 'List Property',
        to: '/realtor/properties/list',
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Settings',
    to: '/#',
    icon: 'cil-settings'
  },
]
