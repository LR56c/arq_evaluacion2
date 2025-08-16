import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { wrapType }                    from "../../shared/utils/wrap_type"
import {
  UUID
}                                      from "../../shared/domain/value_objects/uuid"
import {
  ValidInteger
}                                      from "../../shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
}                                      from "../../shared/domain/exceptions/data_not_found_exception"
import { UserDAO }                     from "../domain/user_dao"
import { User }                        from "../domain/user"

export const ensureUserExist = async ( dao: UserDAO,
  id: string ): Promise<Either<BaseException[], User>> => {
  const _id = wrapType( () => UUID.from( id ) )

  if ( _id instanceof BaseException ) {
    return left( [_id] )
  }

  const user = await dao.search(
    { id: _id.toString() }, ValidInteger.from( 1 ) )

  if ( isLeft( user ) ) {
    return left( user.left )
  }

  if ( user.right[0].id.toString() !== id ) {
    return left( [new DataNotFoundException()] )
  }


  return right( user.right[0] )
}