import { defineStore }    from "pinia"
import { BetterAuthData } from "~~/modules/user/infrastructure/better_auth_data"
import type {
  LoginRequest
}                         from "~~/modules/user/application/models/login_request"
import type {
  RegisterRequest
} from "~~/modules/user/application/models/register_request"

const auth                = new BetterAuthData()
export const useAuthStore = defineStore( "auth", () => {
  const login = async ( dto: LoginRequest ) => {
    return await auth.login( dto )
  }

  const logout = async () => {
    return await auth.logout()
  }

  const register = async ( dto: RegisterRequest ) => {
    return await auth.register( dto )
  }

  const anonymous = async () => {
    return await auth.anonymous()
  }

  return {
    login,
    logout,
    register,
    anonymous
  }
} )