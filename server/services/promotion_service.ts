import type { Either }         from "fp-ts/Either"
import { isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "~~/modules/shared/domain/exceptions/base_exception"
import type {
  PaginatedResult
}                              from "~~/modules/shared/domain/paginated_result"
import {
  AddPromotion
}                              from "~~/modules/promotion/application/add_promotion"
import {
  RemovePromotion
}                              from "~~/modules/promotion/application/remove_promotion"
import {
  SearchPromotion
}                              from "~~/modules/promotion/application/search_promotion"
import {
  UpdatePromotion
}                              from "~~/modules/promotion/application/update_promotion"
import {
  PromotionInstrumentation
}                              from "~~/server/instrumentation/promotion_instrumentation"
import {
  PromotionDTO
}                              from "~~/modules/promotion/application/promotion_dto"
import {
  PromotionMapper
}                              from "~~/modules/promotion/application/promotion_mapper"
import {
  PromotionUpdateDTO
}                              from "~~/modules/promotion/application/promotion_update_dto"

export class PromotionService {
  constructor(
    private readonly addPromotion: AddPromotion,
    private readonly removePromotion: RemovePromotion,
    private readonly searchPromotion: SearchPromotion,
    private readonly updatePromotion: UpdatePromotion,
    private readonly instrumentation: PromotionInstrumentation
  )
  {
  }

  async add( dto: PromotionDTO ): Promise<Either<BaseException[], boolean>> {
    const result = await this.addPromotion.execute( dto )
    if ( isLeft( result ) ) {
      await this.instrumentation.addPromotionFailed( result.left )
    }
    return right( true )
  }

  async remove( id: string ): Promise<Either<BaseException[], boolean>> {
    const result = await this.removePromotion.execute( id )
    if ( isLeft( result ) ) {
      await this.instrumentation.removePromotionFailed( result.left )
    }
    return right( true )
  }

  async search( query: Record<string, any>, limit ?: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<PromotionDTO>>> {
    const result = await this.searchPromotion.execute( query, limit, skip, sortBy,
      sortType )

    if ( isLeft( result ) ) {
      await this.instrumentation.searchPromotionFailed( result.left )
      return left( result.left )
    }

    return right( {
      total: result.right.total,
      items: result.right.items.map( PromotionMapper.toDTO )
    } )
  }

  async update( dto: PromotionUpdateDTO ): Promise<Either<BaseException[], boolean>> {
    const result = await this.updatePromotion.execute( dto )
    if ( isLeft( result ) ) {
      await this.instrumentation.updatePromotionFailed( result.left )
    }
    return right( true )
  }
}
