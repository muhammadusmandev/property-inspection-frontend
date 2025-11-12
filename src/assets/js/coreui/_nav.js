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
        to: '/realtor/properties/add_property',
      },
      {
        component: 'CNavItem',
        name: 'List Properties',
        to: '/realtor/properties/list',
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
        name: 'Add Report',
        to: '/realtor/reports/#',
      },
      {
        component: 'CNavItem',
        name: 'List Reports',
        to: '/realtor/reports/#',
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
        to: '/realtor/clients/add_client',
      },
      {
        component: 'CNavItem',
        name: 'List Clients',
        to: '/realtor/clients/list',
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
        to: '/realtor/branches/add_branch',
      },
      {
        component: 'CNavItem',
        name: 'List Branches',
        to: '/realtor/branches/list',
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Templates',
    to: '/realtor/templates/list',
    icon: 'cil-text-square',
  },
  {
    component: 'CNavItem',
    name: 'Inspection Areas',
    to: '/realtor/inspection_areas/list',
    icon: 'cil-search',
  },
  {
    component: 'CNavTitle',
    name: 'Account',
  },
  {
    component: 'CNavItem',
    name: 'Settings',
    to: '/#',
    icon: 'cil-settings'
  },
]
