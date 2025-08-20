import { PromotionDAO }                from "../domain/promotion_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { PromotionDTO }                from "./promotion_dto"
import { containError }                from "../../shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "../../shared/domain/exceptions/data_not_found_exception"
import { ensurePromotionExist }        from "../utils/ensure_promotion_exist"
import { Promotion }                   from "../domain/promotion"
import {
  Errors
}                                      from "../../shared/domain/exceptions/errors"
import {
  SearchProduct
}                                      from "../../product/application/search_product"
import { combineProducts }             from "../utils/combine_products"

export class AddPromotion {
  constructor(
    private readonly dao: PromotionDAO,
    private readonly searchProducts: SearchProduct
  )
  {
  }


  async execute( dto: PromotionDTO ): Promise<Either<BaseException[], boolean>> {

    const existResult = await ensurePromotionExist( this.dao, dto.id )

    if ( isLeft( existResult ) ) {
      if ( !containError( existResult.left, new DataNotFoundException() ) ) {
        return left( existResult.left )
      }
    }

    const verifyProducts = await combineProducts(this.searchProducts, dto.products )

    if ( isLeft( verifyProducts ) ) {
      return left( verifyProducts.left )
    }

    const promotion = Promotion.create(
      dto.id,
      dto.name,
      dto.percentage,
      dto.start_date,
      dto.end_date,
      dto.is_active,
      verifyProducts.right,
      dto.description
    )

    if ( promotion instanceof Errors ) {
      return left( promotion.values )
    }

    const result = await this.dao.add( promotion )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}