import { AuthAppService }  from "../application/auth_app_service"
import type { UserResponse }    from "../application/models/user_response"
import type { LoginRequest }    from "../application/models/login_request"
import type { RegisterRequest } from "../application/models/register_request"
import { authClient }      from "~~/lib/auth_client"

export class BetterAuthData implements AuthAppService {
  async anonymous(): Promise<UserResponse> {
    return {}
  }

  async login( dto: LoginRequest ): Promise<UserResponse> {
    const { data, error } = await authClient.signIn.email( {
      email   : dto.email,
      password: dto.password
    } )
    console.log( "login", data, error )
    return {}
  }

  async logout( token?: string ): Promise<UserResponse> {
    const { data, error } = await authClient.signOut()
    console.log( "logout", data, error )
    return {}
  }

  async register( dto: RegisterRequest ): Promise<UserResponse> {
    const { data, error } = await authClient.signUp.email( {
      name    : dto.name,
      email   : dto.email,
      password: dto.password
    } )
    console.log( "register", data, error )
    return {}
  }

}