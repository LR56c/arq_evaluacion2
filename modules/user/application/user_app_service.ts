import { UserRequest } from "./user_request"
import { UserResponse } from "./user_response"

export abstract class UserAppService {
  abstract add( user: UserRequest ): Promise<UserResponse>

  abstract search( query: string ): Promise<UserResponse[]>

  abstract remove( id: string ): Promise<void>

  abstract update( id: string, user: UserResponse ): Promise<UserResponse>
}
