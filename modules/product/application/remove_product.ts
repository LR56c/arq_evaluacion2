import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { ProductDAO }                  from "../domain/product_dao"
import { ensureProductExist }          from "../utils/ensure_product_exist"

export class RemoveProduct {
  constructor( private readonly dao: ProductDAO ) {
  }

  async execute( id: string ): Promise<Either<BaseException[], boolean>> {

    const exist = await ensureProductExist( this.dao, id )

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