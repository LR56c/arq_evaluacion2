import { type Either, isLeft, left, right } from "fp-ts/Either"
import { RoleDAO }                          from "../domain/role_dao"
import {
  BaseException
}                                           from "../../shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                                           from "../../shared/domain/value_objects/valid_integer"

export class RemoveRole {
  constructor( private readonly dao: RoleDAO ) {
  }

  async execute( name: string ): Promise<Either<BaseException[], boolean>> {
    const exist = await this.dao.search( {
      name: name
    }, ValidInteger.from( 1 ) )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const result = await this.dao.remove( exist.right[0]!.id )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}
