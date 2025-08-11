import { type Either, isLeft, left, right } from "fp-ts/Either"
import { RoleDAO }                          from "../domain/role_dao"
import {
  BaseException
}                                           from "../../shared/domain/exceptions/base_exception"
import { Role }                             from "../domain/role"
import {
  UUID
}                                           from "../../shared/domain/value_objects/uuid"
import {
  DataNotFoundException
}                                           from "../../shared/domain/exceptions/data_not_found_exception"
import { wrapType }                         from "../../shared/utils/wrap_type"
import {
  ValidString
}                                           from "../../shared/domain/value_objects/valid_string"
import {
  ValidDate
}                                           from "../../shared/domain/value_objects/valid_date"
import {
  ValidInteger
}                                           from "../../shared/domain/value_objects/valid_integer"

export class UpdateRole {
  constructor( private readonly dao: RoleDAO ) {
  }

  private async ensureRoleExist( name: string ): Promise<Either<BaseException[], Role>> {
    const existResult = await this.dao.search( {
      name: name
    }, ValidInteger.from( 1 ) )

    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    if ( existResult.right.length > 0 &&
      existResult.right[0]!.name.value !== name )
    {
      return left( [new DataNotFoundException()] )
    }
    return right( existResult.right[0]! )
  }


  async execute( prevName: string,
    newName: string ): Promise<Either<BaseException[], boolean>> {
    const vname = wrapType( () => ValidString.from( newName ) )

    if ( vname instanceof BaseException ) {
      return left( [vname] )
    }

    const roleResult = await this.ensureRoleExist( prevName )


    if ( isLeft( roleResult ) ) {
      return left( roleResult.left )
    }

    const role = roleResult.right

    const newRole = Role.from(
      role.id,
      vname as ValidString,
      role.createdAt,
      ValidDate.now()
    )

    const updateResult = await this.dao.update( newRole )

    if ( isLeft( updateResult ) ) {
      return left( [updateResult.left] )
    }

    return right( true )
  }
}
