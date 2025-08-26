import { type Either, isLeft, left, right } from "fp-ts/Either"
import type {
  UserDAO
}                                           from "~~/modules/user/domain/user_dao"
import type {
  BaseException
}                                           from "~~/modules/shared/domain/exceptions/base_exception"
import {
  ensureUserExist
}                                           from "~~/modules/user/utils/ensure_user_exist"
export class RemoveUser {
  constructor( private readonly dao: UserDAO ) {
  }

  async execute( id: string ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensureUserExist(this.dao, id)

    if( isLeft( exist ) ) {
      return left( exist.left )
    }

    const result = await this.dao.remove( exist.right.id )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}
