import type {
  LoginRequest
} from "~~/modules/user/application/models/login_request"
import type {
  UserResponse
} from "~~/modules/user/application/models/user_response"
import type {
  RegisterRequest
} from "~~/modules/user/application/models/register_request"

export abstract class AuthAppService {
  abstract login( dto: LoginRequest ): Promise<UserResponse>

  abstract logout( token ?: string ): Promise<UserResponse>

  abstract register( dto: RegisterRequest ): Promise<UserResponse>

  abstract anonymous(): Promise<UserResponse>
}
