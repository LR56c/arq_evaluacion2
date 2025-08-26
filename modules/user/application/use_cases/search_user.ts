import { type Either, isLeft, left } from "fp-ts/Either"
import type { UserDAO }              from "~~/modules/user/domain/user_dao"
import type {
  BaseException
}                                    from "~~/modules/shared/domain/exceptions/base_exception"
import type {
  PaginatedResult
}                                    from "~~/modules/shared/domain/paginated_result"
import type { User }                 from "~~/modules/user/domain/user"
import {
  genericEnsureSearch
}                                    from "~~/modules/shared/utils/generic_ensure_search"

export class SearchUser {
  constructor( private readonly dao: UserDAO ) {
  }

  async execute( query: Record<string, any>, limit?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<User>>> {
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
