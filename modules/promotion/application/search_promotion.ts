import { Either, isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                               from "../../shared/domain/exceptions/base_exception"
import { genericEnsureSearch } from "../../shared/utils/generic_ensure_search"
import { PromotionDAO }         from "../domain/promotion_dao"
import { Promotion }            from "../domain/promotion"
import { PaginatedResult }      from "../../shared/domain/paginated_result"

export class SearchPromotion {
  constructor( private readonly dao: PromotionDAO ) {
  }

  async execute( query: Record<string, any>, limit ?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<Promotion>>> {
    const searchParamsResult = genericEnsureSearch( limit, skip, sortBy,
      sortType )

    if ( isLeft( searchParamsResult ) ) {
      return left( searchParamsResult.left )
    }

    const {
            validLimit,
            validSkip,
            validSortBy,
            validSortType
          } = searchParamsResult.right

    return this.dao.search( query, validLimit, validSkip, validSortBy,
      validSortType )
  }
}
