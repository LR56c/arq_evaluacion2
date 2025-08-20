import { SearchProduct }               from "../../product/application/search_product"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { OrderItemDTO }                from "../application/order_item_dto"
import { OrderItem }                   from "../domain/order_item"
import {
  Errors
}                                      from "../../shared/domain/exceptions/errors"

export const combineOrderProducts = async ( searchProducts: SearchProduct,
  dtos: OrderItemDTO[] ): Promise<Either<BaseException[], OrderItem[]>> => {
  const tempMap        = new Map<string, OrderItemDTO>(
    dtos.map( item => [item.product.id, item] )
  )
  const verifyProducts = await searchProducts.execute( {
    ids: dtos.map( dto => dto.product.id ).join( "," )
  } )

  if ( isLeft( verifyProducts ) ) {
    return left( verifyProducts.left )
  }

  const products                = verifyProducts.right.items
  const orderItems: OrderItem[] = []
  for ( const product of products ) {
    const orderItem = tempMap.get( product.id.toString() )
    if ( orderItem ) {
      const item = OrderItem.fromPrimitives(
        orderItem.id,
        orderItem.price_at_purchase,
        product,
        orderItem.quantity,
      )
      if ( item instanceof Errors ) {
        return left( item.values )
      }
      orderItems.push( item )
    }
  }

  return right( orderItems )
}