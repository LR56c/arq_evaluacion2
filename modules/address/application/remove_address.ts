import { AddressDAO }                  from "../domain/address_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { ensureAddressExist }          from "../utils/ensure_address_exist"

export class RemoveAddress {
  constructor( private readonly dao: AddressDAO ) {
  }

  async remove( id: string ): Promise<Either<BaseException[], boolean>> {

    const exist = await ensureAddressExist( this.dao, id )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const result = await this.dao.remove( exist.right.id )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}