import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { OrderDAO }                    from "../domain/order_dao"
import { ensureOrderExist }            from "../utils/ensure_order_exist"

export class RemoveOrder {
  constructor( private readonly dao: OrderDAO ) {
  }

  async execute( id: string ): Promise<Either<BaseException[], boolean>> {

    const exist = await ensureOrderExist( this.dao, id )

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