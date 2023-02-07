// ** Icon imports
import AccountSwitch from 'mdi-material-ui/AccountSwitch'

// import Table from 'mdi-material-ui/Table'
// import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'

// import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'

import AccountSync from 'mdi-material-ui/AccountSync'

// import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
// import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
// import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'My Account',
      icon: AccountCogOutline,
      path: '/account-settings'
    },
    {
      sectionTitle: 'Users'
    },
    {
      title: 'Users',
      icon: AccountSwitch,
      path: '/pages/users',
    },
    {
      title: 'Admins',

      icon: AccountSync,
      path: '/pages/admins',
    },
    {
      sectionTitle: 'Physical'
    },
    {
      sectionTitle: 'Nutrition'
    },
    {
      sectionTitle: 'Articles'
    },
    {
      sectionTitle: 'Challanges'
    },
    
    // {
    //   sectionTitle: 'User Interface'
    // },
    // {
    //   title: 'Typography',
    //   icon: FormatLetterCase,
    //   path: '/typography'
    // },
    // {
    //   title: 'Icons',
    //   path: '/icons',
    //   icon: GoogleCirclesExtended
    // },
    // {
    //   title: 'Cards',
    //   icon: CreditCardOutline,
    //   path: '/cards'
    // },
    // {
    //   title: 'Tables',
    //   icon: Table,
    //   path: '/tables'
    // },
    // {
    //   icon: CubeOutline,
    //   title: 'Form Layouts',
    //   path: '/form-layouts'
    // }
  ]
}

export default navigation
