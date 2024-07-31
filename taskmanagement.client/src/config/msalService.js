import { ref } from 'vue'
import { msalInstance, state } from './msalConfig'
import store from '../store'

export function msalService() {
  const isAuthenticated = ref(false)
  let isInteractionInProgress = false

  const createUserRequest = {
    userName: '',
    firstName: '',
    lastName: '',
    email: ''
  }

  const initialize = async () => {
    try {
      await msalInstance.initialize()
    } catch (error) {
      console.log('Initialization error', error)
    }
  }

  const login = async () => {
    try {
      if (!msalInstance) {
        throw new Error('MSAL not initialized. Call initializeMsal() before using MSAL API.')
      }
      await msalInstance.loginRedirect()
      state.isAuthenticated = true
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const logout = () => {
    if (!msalInstance) {
      throw new Error('MSAL not initialized. Call initializeMsal() before using MSAL API.')
    }
    msalInstance.logoutRedirect()
    state.isAuthenticated = false
    state.user = null
  }

  const checkAuthentication = async () => {
    try {
      const accounts = msalInstance.getAllAccounts()
      if (accounts.length > 0) {
        state.isAuthenticated = true
        state.user = accounts[0]
        setUserInfo(state.user)
      } else {
        msalInstance.loginRedirect()
      }
    } catch (error) {
      console.log('Check Authentication', error)
    }
  }

  const setUserInfo = async (userState) => {
    const userExist = await store.dispatch('user/getByMail', userState.username)
    await store.dispatch('user/setUser', userExist)
  }

  const handleRedirect = async () => {
    try {
      if (isInteractionInProgress) {
        return
      }

      isInteractionInProgress = true
      await msalInstance.handleRedirectPromise().then(() => {
        const accounts = msalInstance.getAllAccounts()
        if (accounts.length === 0) {
          msalInstance.loginRedirect()
        }
      })

      const accounts = msalInstance.getAllAccounts()
      if (accounts.length > 0) {
        state.isAuthenticated = true
        state.user = msalInstance.getAllAccounts()[0]

        const userExist = await store.dispatch('user/getByMail', state.user.username)
        if (userExist.id == 0) {
          const fullName = state.user.name
          const email = state.user.username

          let nameParts = fullName.split(' ')
          let mailParts = email.split('@')

          createUserRequest.userName = mailParts[0]
          createUserRequest.firstName = nameParts[0]
          createUserRequest.lastName = nameParts[1]
          createUserRequest.email = email

          const isCreate = await store.dispatch('user/createUser', createUserRequest)
          if (isCreate) {
            msalInstance.loginRedirect()
          }
        }

        const accessToken = await msalInstance.acquireTokenSilent({
          account: accounts[0],
          scopes: ['user.read']
        })

        if (accessToken) {
          const response = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: {
              Authorization: `Bearer ${accessToken.accessToken}`
            }
          })

          if (response.ok) {
            const profile = await response.json()
            state.profile = {
              displayName: profile.displayName,
              jobTitle: profile.jobTitle,
              avatar: ''
            }

            const photoResponse = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
              headers: {
                Authorization: `Bearer ${accessToken.accessToken}`
              }
            })

            if (photoResponse.ok) {
              const blob = await photoResponse.blob()
              const objectURL = URL.createObjectURL(blob)
              state.profile.avatar = objectURL
            } else if (photoResponse.status === 404) {
              console.warn('User photo not found')
              state.profile.avatar =
                'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
            } else {
              console.warn('Failed to fetch user photo')
            }

            await store.dispatch('user/login', userExist.userName)
          } else {
            throw new Error('Failed to fetch user profile')
          }
        } else {
          throw new Error('Access token not available')
        }
      }
    } catch (error) {
      console.error('Redirect error:', error)
    } finally {
      isInteractionInProgress = false
    }
  }

  return {
    isAuthenticated,
    initialize,
    login,
    logout,
    checkAuthentication,
    handleRedirect
  }
}
