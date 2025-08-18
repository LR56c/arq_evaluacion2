import { Either, isLeft, left, right } from "fp-ts/Either"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { wrapType } from "../../shared/utils/wrap_type"
import { UUID } from "../../shared/domain/value_objects/uuid"
import {
  ValidInteger
} from "../../shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
} from "../../shared/domain/exceptions/data_not_found_exception"
import { ProductDAO }                  from "../domain/product_dao"
import { Product }                     from "../domain/product"

export const ensureProductExist = async ( dao : ProductDAO, id: string): Promise<Either<BaseException[], Product>> => {
  const _id = wrapType(()=>UUID.from(id))

  if (_id instanceof BaseException) {
    return left( [_id] )
  }

  const address = await dao.search(
    { id: _id.toString() }, ValidInteger.from(1))

  if (isLeft(address)) {
    return left(address.left)
  }

  if(address.right[0].id.toString() !== id) {
    return left( [new DataNotFoundException()] )
  }


  return right( address.right[0] )
}