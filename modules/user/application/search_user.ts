import { type Either, isLeft, left } from "fp-ts/Either"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"
import { User }                      from "../domain/user"
import {
  genericEnsureSearch
}                                    from "../../shared/utils/generic_ensure_search"
import { UserDAO }                   from "../domain/user_dao"
import { PaginatedResult }           from "../../shared/domain/paginated_result"

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
