import { type Either, isLeft, left, right } from "fp-ts/Either"
import { RoleDAO }                          from "../domain/role_dao"
import {
  BaseException
}                                           from "../../shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                                           from "../../shared/domain/value_objects/valid_integer"
import {
  DataAlreadyExistException
}                                           from "../../shared/domain/exceptions/data_already_exist_exception"
import { RoleDTO }                          from "./role_dto"
import { Role }                             from "../domain/role"
import {
  Errors
}                                           from "../../shared/domain/exceptions/errors"
import {
  UUID
}                                           from "../../shared/domain/value_objects/uuid"

export class AddRole {
  constructor( private readonly dao: RoleDAO ) {
  }

  private async ensureRoleExist( name: string ): Promise<Either<BaseException[], boolean>> {
    const existResult = await this.dao.search( {
      name: name
    }, ValidInteger.from( 1 ) )

    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    if ( existResult.right.length > 0 &&
      existResult.right[0]!.name.value === name )
    {
      return left( [new DataAlreadyExistException()] )
    }
    return right( true )
  }


  async execute( dto: RoleDTO ): Promise<Either<BaseException[], boolean>> {
    const roleNotExist = await this.ensureRoleExist( dto.name )

    if ( isLeft( roleNotExist ) ) {
      return left( roleNotExist.left )
    }

    const role = Role.create( UUID.create().toString(), dto.name )

    if ( role instanceof Errors ) {
      return left( role.values )
    }

    const result = await this.dao.add( role )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}
