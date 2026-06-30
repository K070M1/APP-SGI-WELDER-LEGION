export const ROUTES = {
  AUTH: {
    LOGIN: 'Auth_Login',
    FORGOT_PASSWORD: 'Auth_ForgotPassword',
  },
  DASHBOARD: {
    LIST: 'Dashboard_List',
  },
  MAIN: {
    TABS: 'Main_Tabs',
  },
  PRODUCTS: {
    LIST: 'Products_List',
    FORM: 'Products_Form',
    DETAIL: 'Products_Detail',
  },
  MOVEMENTS: {
    LIST: 'Movements_List',
    FORM: 'Movements_Form',
    DETAIL: 'Movements_Detail',
  },
  USERS: {
    LIST: 'Users_List',
    FORM: 'Users_Form',
  },
  SCANNER: {
    CAMERA: 'Scanner_Camera',
  },
  PROFILE: {
    MAIN: 'Profile_Main',
    EDIT: 'Profile_Edit',
  }
} as const;