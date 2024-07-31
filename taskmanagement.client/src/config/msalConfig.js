import { PublicClientApplication } from '@azure/msal-browser'
import { reactive } from 'vue'

export const msalConfig = {
  auth: {
    clientId: 'b961f19a-70bc-4aa9-9a86-0b5d350b6ecd',
    authority: 'https://login.microsoftonline.com/0575abd7-fffe-4570-ad60-47e243646619',
    redirectUri: 'http://localhost:5173/signin-oidc'
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
