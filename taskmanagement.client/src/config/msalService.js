import { ref } from 'vue'
import { msalInstance, state } from './msalConfig'
import store from '../store'

export function msalService() {
    const isAuthenticated = ref(false)

    const initialize = async () => {
        try {
            // Assume msalInstance is already configured, so no need to call initialize() on it
            await msalInstance.initialize(); // Remove this if msalInstance is already configured
            //await handleRedirect() // Handle redirect after initialization
        } catch (error) {
            console.error('Initialization error:', error)
        }
    }

    const login = async () => {
        try {
            if (!msalInstance) {
                throw new Error('MSAL instance is not available.')
            }
            await msalInstance.loginRedirect()
            // You don't need to set state.isAuthenticated here, handleRedirect will do it after login
        } catch (error) {
            console.error('Login error:', error)
        }
    }

    const logout = async () => {
        try {
            if (!msalInstance) {
                throw new Error('MSAL instance is not available.')
            }
            await msalInstance.logoutRedirect()
            state.isAuthenticated = false
            state.user = null
            console.log('Logout successful')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    const handleRedirect = async () => {
        try {
            const response = await msalInstance.handleRedirectPromise()
            if (response) {
                state.isAuthenticated = response.account !== null
                state.user = response.account
                let tokenStr = response.accessToken
                await store.dispatch('user/login', { userName: state.user.name, token: tokenStr })
            } else {
                state.isAuthenticated = msalInstance.getAllAccounts().length > 0
                state.user = msalInstance.getAllAccounts()[0] || null
            }
        } catch (error) {
            console.error('Redirect error:', error)
        }
    }

    return {
        isAuthenticated,
        initialize,
        login,
        logout,
        handleRedirect
    }
}
