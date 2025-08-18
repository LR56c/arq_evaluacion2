import { Either, isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                               from "../../shared/domain/exceptions/base_exception"
import { genericEnsureSearch } from "../../shared/utils/generic_ensure_search"
import { ProductDAO }           from "../domain/product_dao"
import { Product }              from "../domain/product"
import { PaginatedResult }      from "../../shared/domain/paginated_result"

export class SearchProduct {
  constructor( private readonly dao: ProductDAO ) {
  }

  async execute( query: Record<string, any>, limit ?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<Product>>> {
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
