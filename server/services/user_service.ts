import { AddUser }             from "~~/modules/user/application/add_user"
import { SearchUser }          from "~~/modules/user/application/search_user"
import { RemoveUser }          from "~~/modules/user/application/remove_user"
import { UpdateUser }          from "~~/modules/user/application/update_user"
import type { UserRequest }    from "~~/modules/user/application/user_request"
import type { Either }         from "fp-ts/Either"
import { isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "~~/modules/shared/domain/exceptions/base_exception"
import type {
  UserUpdateDTO
}                              from "~~/modules/user/application/user_update_dto"
import {
  UserInstrumentation
}                              from "~~/server/instrumentation/user_instrumentation"
import { UserMapper }          from "~~/modules/user/application/user_mapper"
import { UserResponse }        from "~~/modules/user/application/user_response"
import { PaginatedResult }     from "~~/modules/shared/domain/paginated_result"

export class UserService {
  constructor(
    private readonly addUser: AddUser,
    private readonly searchUser: SearchUser,
    private readonly removeUser: RemoveUser,
    private readonly updateUser: UpdateUser,
    private readonly instrumentation: UserInstrumentation
  )
  {
  }

  async add( request: UserRequest ): Promise<Either<BaseException[], UserResponse>> {
    const result = await this.addUser.execute( request )
    if ( isLeft( result ) ) {
      await this.instrumentation.addUserFailed( result.left )
      return left( result.left )
    }
    return right( UserMapper.toResponse( result.right ) )
  }

  async search( query: Record<string, any>, limit?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<UserResponse>>> {
    const result = await this.searchUser.execute( query, limit, skip, sortBy,
      sortType )
    if ( isLeft( result ) ) {
      await this.instrumentation.searchUserFailed( result.left )
      return left( result.left )
    }
    return right( {
      items: result.right.items.map( user => UserMapper.toResponse( user ) ),
      total: result.right.total,
    } )
  }

  async remove( id: string ): Promise<Either<BaseException[], boolean>> {
    const result = await this.removeUser.execute( id )
    if ( isLeft( result ) ) {
      await this.instrumentation.removeUserFailedFailed( result.left )
    }
    return result
  }

  async update( dto: UserUpdateDTO ): Promise<Either<BaseException[], UserResponse>> {
    const result = await this.updateUser.execute( dto )
    if ( isLeft( result ) ) {
      await this.instrumentation.updateUserFailed( result.left )
      return left( result.left )
    }
    return right( UserMapper.toResponse( result.right ) )
  }
}
