import { PromotionProduct } from "../domain/promotion_product"
import { BaseException }               from "../../shared/domain/exceptions/base_exception"
import { Either, isLeft, left, right } from "fp-ts/Either"
import { SearchProduct }               from "../../product/application/search_product"
import { Errors } from "../../shared/domain/exceptions/errors"
import { PromotionProductDTO } from "../application/promotion_product_dto"

export const combineProducts = async (searchProducts : SearchProduct, dtos: PromotionProductDTO[] ): Promise<Either<BaseException[], PromotionProduct[]>> => {
  const tempQuantityMap = new Map<string, number>(
    dtos.map( p => [p.product.id, p.quantity] )
  )

  const verifyProducts = await searchProducts.execute(
    { ids: dtos.map( p => p.product.id ).join( "," ) } )

  if ( isLeft( verifyProducts ) ) {
  return left( verifyProducts.left )
}

const products                              = verifyProducts.right.items
const promotionProducts: PromotionProduct[] = []
for ( const product of products ) {
  const quantity = tempQuantityMap.get( product.id.toString() )
  if ( quantity ) {
    const pp = PromotionProduct.create( product, quantity )
    if ( pp instanceof Errors ) {
      return left( pp.values )
    }
    promotionProducts.push( pp )
  }
}
return right( promotionProducts )
}
