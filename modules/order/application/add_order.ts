import { OrderDAO }                    from "../domain/order_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { OrderDTO }             from "./order_dto"
import { ensureOrderExist }     from "../utils/ensure_order_exist"
import {
  DataNotFoundException
}                               from "../../shared/domain/exceptions/data_not_found_exception"
import { containError }         from "../../shared/utils/contain_error"
import { SearchUser }           from "../../user/application/search_user"
import { SearchProduct }        from "../../product/application/search_product"
import { combineProducts }      from "../../promotion/utils/combine_products"
import { combineOrderProducts } from "../utils/combine_order_products"
import { Order }                from "../domain/order"
import { Errors }               from "../../shared/domain/exceptions/errors"

export class AddOrder {
  constructor(
    private readonly dao: OrderDAO,
    private readonly searchUser: SearchUser,
    private readonly searchProduct: SearchProduct
  )
  {
  }

  async execute( dto: OrderDTO ): Promise<Either<BaseException[], boolean>> {
    const existResult = await ensureOrderExist( this.dao, dto.id )

    if ( isLeft( existResult ) ) {
      if ( !containError( existResult.left, new DataNotFoundException() ) ) {
        return left( existResult.left )
      }
    }

    const existUser = await this.searchUser.execute( { id: dto.user.id }, 1 )

    if ( isLeft( existUser ) ) {
      return left( existUser.left )
    }
    const user = existUser.right.items[0]

    const verifyProducts = await combineOrderProducts( this.searchProduct,
      dto.items )

    if ( isLeft( verifyProducts ) ) {
      return left( verifyProducts.left )
    }

    const order = Order.create(
      dto.id,
      user,
      dto.total,
      dto.status,
      verifyProducts.right,
      dto.created_at
    )

    if ( order instanceof Errors ) {
      return left( order.values )
    }

    const result = await this.dao.add( order )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right(true)
  }
}