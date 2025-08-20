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
import { OrderDAO }                    from "../domain/order_dao"
import { Order }                       from "../domain/order"

export const ensureOrderExist = async ( dao : OrderDAO, id: string): Promise<Either<BaseException[], Order>> => {
  const _id = wrapType(()=>UUID.from(id))

  if (_id instanceof BaseException) {
    return left( [_id] )
  }

  const order = await dao.search(
    { id: _id.toString() }, ValidInteger.from(1))

  if (isLeft(order)) {
    return left(order.left)
  }

  if(order.right[0].id.toString() !== id) {
    return left( [new DataNotFoundException()] )
  }


  return right( order.right[0] )
}