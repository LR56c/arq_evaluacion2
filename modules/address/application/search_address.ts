import { type Either, isLeft, left } from "fp-ts/Either"
import { AddressDAO }                from "../domain/address_dao"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"
import { Address }                   from "../domain/address"
import {
  genericEnsureSearch
}                                    from "../../shared/utils/generic_ensure_search"
import { PaginatedResult }           from "../../shared/domain/paginated_result"

export class SearchAddress {
  constructor( private readonly dao: AddressDAO ) {
  }

  async execute( query: Record<string, any>, limit ?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<Address>>> {
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
