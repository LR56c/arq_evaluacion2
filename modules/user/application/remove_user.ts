import { type Either, isLeft, left, right } from "fp-ts/Either"
import { UserDAO }                          from "../domain/user_dao"
import {
  BaseException
}                                           from "../../shared/domain/exceptions/base_exception"
import { ensureUserExist }                  from "../utils/ensure_user_exist"

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
