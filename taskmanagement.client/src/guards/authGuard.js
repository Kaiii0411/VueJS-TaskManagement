import { msalService } from '../config/msalService'
import { state } from '../config/msalConfig'

const { checkAuthentication } = msalService()

export const authGuard = async (to, from, next) => {
  if (!state.isAuthenticated) {
    try {
      await checkAuthentication()
      next()
    } catch (error) {
      console.error('Authentication error:', error)
    }
  } else {
    next()
  }
}
