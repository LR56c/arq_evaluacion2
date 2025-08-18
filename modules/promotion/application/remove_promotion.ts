import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { PromotionDAO }                from "../domain/promotion_dao"
import { ensurePromotionExist }        from "../utils/ensure_promotion_exist"

export class RemovePromotion {
  constructor( private readonly dao: PromotionDAO ) {
  }

  async execute( id: string ): Promise<Either<BaseException[], boolean>> {

    const exist = await ensurePromotionExist( this.dao, id )

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