import { type Either, isLeft, left, right } from "fp-ts/Either"
import type {
  UserDAO
}                                           from "~~/modules/user/domain/user_dao"
import type {
  SearchRole
}                                           from "~~/modules/role/application/search_role"
import type {
  UserUpdateDTO
}                                           from "~~/modules/user/application/models/user_update_dto"
import type {
  BaseException
}                                           from "~~/modules/shared/domain/exceptions/base_exception"
import { User }                             from "~~/modules/user/domain/user"
import {
  ensureUserExist
}                                           from "~~/modules/user/utils/ensure_user_exist"
import { Role }                             from "~~/modules/role/domain/role"
import {
  ensureRoles
}                                           from "~~/modules/user/utils/ensure_roles"
import {
  Errors
}                                           from "~~/modules/shared/domain/exceptions/errors"

export class UpdateUser {
  constructor(
    private readonly dao: UserDAO,
    private readonly searchRole: SearchRole
  )
  {
  }


  async execute( dto: UserUpdateDTO ): Promise<Either<BaseException[], User>> {
    const userResult = await ensureUserExist( this.dao, dto.id )

    if ( isLeft( userResult ) ) {
      return left( userResult.left )
    }

    const errors = []

    const prevUser = userResult.right

    let newRoles: Role[] = []
    if ( dto.roles ) {
      const roles = await ensureRoles( this.searchRole, dto.roles )

      if ( isLeft( roles ) ) {
        errors.push( ...roles.left )
      }
      else {
        newRoles.push( ...roles.right )
      }
    }
    else if ( dto.roles === null ) {
      newRoles = []
    }
    else {
      newRoles.push( ...prevUser.roles )
    }

    if ( errors.length ) {
      return left( errors )
    }

    const newUser = User.fromPrimitives(
      prevUser.id.toString(),
      prevUser.name.value,
      prevUser.email.value,
      dto.metadata ? dto.metadata : prevUser.metadata.toString(),
      newRoles,
      prevUser.createdAt.toString(),
      prevUser.updatedAt?.toString()
    )

    if ( newUser instanceof Errors ) {
      return left( newUser.values )
    }

    const result = await this.dao.update( newUser )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( newUser )
  }

}
