import { PublicClientApplication } from '@azure/msal-browser'
import { reactive } from 'vue'

export const msalConfig = {
    auth: {
        clientId: '09b9acae-d69f-4b74-b851-639d2ed117cb',
        authority: 'https://login.microsoftonline.com/6fd4ab17-aa9f-470d-a477-f241ef4dd858',
        redirectUri: 'https://192.168.1.145:5173/signin-oidc',
        postLogoutRedirectUri: 'https://192.168.1.145:5173/'
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false
    }
  }
  
  export const graphScopes = {
    scopes: ['user.read', 'openid', 'profile']
  }
  
  export const state = reactive({
    isAuthenticated: false,
    user: null,
    profile: {
      displayName: '',
      jobTitle: '',
      avatar: ''
    }
  })
  
  export const msalInstance = new PublicClientApplication(msalConfig)