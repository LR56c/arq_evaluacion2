import { OrderDAO }                    from "../domain/order_dao"
import { SearchUser }                  from "../../user/application/search_user"
import {
  SearchProduct
}                                      from "../../product/application/search_product"
import { Order }                       from "../domain/order"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { OrderUpdatedDTO }             from "./order_updated_dto"
import { ensureOrderExist }            from "../utils/ensure_order_exist"
import { containError }                from "../../shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "../../shared/domain/exceptions/data_not_found_exception"
import {
  Errors
}                                      from "../../shared/domain/exceptions/errors"
import { combineOrderProducts }        from "../utils/combine_order_products"

export class UpdateOrder {
  constructor(
    private readonly dao: OrderDAO,
    private readonly searchUser: SearchUser,
    private readonly searchProduct: SearchProduct
  )
  {
  }

  async execute( dto: OrderUpdatedDTO ): Promise<Either<BaseException[], boolean>> {
    const existResult = await ensureOrderExist( this.dao, dto.id )

    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    let user = existResult.right.user
    if ( dto.user ) {
      const userExist = await this.searchUser.execute( { id: dto.user.id }, 1 )
      if ( isLeft( userExist ) ) {
        return left( userExist.left )
      }
      if ( userExist.right.items.length === 0 || userExist.right.items[0].id.toString() !== dto.user.id )
      {
        return left( [new DataNotFoundException()] )
      }
      user = userExist.right.items[0]
    }

    let items = existResult.right.items
    if ( dto.items ) {
      const verifyProducts = await combineOrderProducts( this.searchProduct,
        dto.items )

      if ( isLeft( verifyProducts ) ) {
        return left( verifyProducts.left )
      }
      items = verifyProducts.right
    }

    const order = Order.fromPrimitives(
      existResult.right.id.toString(),
      user,
      dto.total ?? existResult.right.total.value,
      dto.status ?? existResult.right.status.value,
      items,
      existResult.right.createdAt.toString(),
      existResult.right.updatedAt?.toString()
    )

    if ( order instanceof Errors ) {
      return left( order.values )
    }

    const result = await this.dao.update( order )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}