import { PromotionDAO }                from "../domain/promotion_dao"
import {
  SearchProduct
}                                      from "../../product/application/search_product"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { ensurePromotionExist }        from "../utils/ensure_promotion_exist"
import { combineProducts }             from "../utils/combine_products"
import { PromotionUpdateDTO }          from "./promotion_update_dto"
import { Promotion }                   from "../domain/promotion"
import {
  Errors
}                                      from "../../shared/domain/exceptions/errors"

export class UpdatePromotion {
  constructor(
    private readonly dao: PromotionDAO,
    private readonly searchProducts: SearchProduct
  )
  {
  }

  async execute( dto: PromotionUpdateDTO ): Promise<Either<BaseException[], boolean>> {
    const existResult = await ensurePromotionExist( this.dao, dto.id )

    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    let promotionProducts = existResult.right.products
    if ( dto.products ) {

      const verifyProducts = await combineProducts( this.searchProducts,
        dto.products )

      if ( isLeft( verifyProducts ) ) {
        return left( verifyProducts.left )
      }
      promotionProducts = verifyProducts.right
    }

    const promotion = Promotion.fromPrimitives(
      existResult.right.id.toString(),
      dto.name ?? existResult.right.name.value,
      dto.percentage ?? existResult.right.percentage.value,
      dto.start_date ?? existResult.right.startDate.toString(),
      dto.end_date ?? existResult.right.endDate.toString(),
      dto.is_active ?? existResult.right.isActive.value,
      promotionProducts,
      existResult.right.createdAt.toString(),
      dto.description ?? existResult.right.description.value
    )

    if ( promotion instanceof Errors ) {
      return left( promotion.values )
    }

    const result = await this.dao.update( promotion )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}