import { type Either, isLeft, left, right } from "fp-ts/Either"
import { UserDAO }                          from "../domain/user_dao"
import {
  SearchRole
}                                           from "../../role/application/search_role"
import {
  BaseException
}                                           from "../../shared/domain/exceptions/base_exception"
import { User }                             from "../domain/user"
import {
  UUID
}                                           from "../../shared/domain/value_objects/uuid"
import { wrapType, wrapTypeDefault }        from "../../shared/utils/wrap_type"
import { UserResponse }                     from "./user_response"
import { ensureUserExist }                  from "../utils/ensure_user_exist"
import { Role }                             from "../../role/domain/role"
import { ensureRoles }                      from "../utils/ensure_roles"
import {
  ValidString
}                                           from "../../shared/domain/value_objects/valid_string"
import { UserUpdateDTO }                    from "./user_update_dto"
import {
  ValidDate
}                                           from "../../shared/domain/value_objects/valid_date"
import {
  ValidJSON
}                                           from "../../shared/domain/json_schema"
import {
  Errors
}                                           from "../../shared/domain/exceptions/errors"

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
      prevUser.updatedAt.toString()
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
