export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer'
  },
  {
    component: 'CNavTitle',
    name: 'Realty Management',
  },
  {
    component: 'CNavGroup',
    name: 'Properties',
    to: '/#',
    icon: 'cil-house',
    items: [
      {
        component: 'CNavItem',
        name: 'Add Property',
        to: '/inspector/properties/add_property',
      },
      {
        component: 'CNavItem',
        name: 'List Properties',
        to: '/inspector/properties/list',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Reports',
    to: '/#',
    icon: 'cil-description',
    items: [
      {
        component: 'CNavItem',
        name: 'List Reports',
        to: '/inspector/reports/list',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Clients/Landlords',
    to: '/#',
    icon: 'cil-group',
    items: [
      {
        component: 'CNavItem',
        name: 'Add Client/Landloard',
        to: '/inspector/clients/add_client',
      },
      {
        component: 'CNavItem',
        name: 'List Clients',
        to: '/inspector/clients/list',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Branches',
    to: '/#',
    icon: 'cil-vector',
    items: [
      {
        component: 'CNavItem',
        name: 'Add Branch',
        to: '/inspector/branches/add_branch',
      },
      {
        component: 'CNavItem',
        name: 'List Branches',
        to: '/inspector/branches/list',
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Templates',
    to: '/inspector/templates/list',
    icon: 'cil-text-square',
  },
  {
    component: 'CNavItem',
    name: 'Inspection Areas',
    to: '/inspector/inspection_areas/list',
    icon: 'cil-search',
  },
  {
    component: 'CNavTitle',
    name: 'Account',
  },
  {
    component: 'CNavItem',
    name: 'Settings',
    to: '/inspector/settings',
    icon: 'cil-settings'
  },
]
