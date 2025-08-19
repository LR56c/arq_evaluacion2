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
import { PromotionDAO }                from "../domain/promotion_dao"
import { Promotion }                   from "../domain/promotion"

export const ensurePromotionExist = async ( dao : PromotionDAO, id: string): Promise<Either<BaseException[], Promotion>> => {
  const _id = wrapType(()=>UUID.from(id))

  if (_id instanceof BaseException) {
    return left( [_id] )
  }

  const promotion = await dao.search(
    { id: _id.toString() }, ValidInteger.from(1))

  if (isLeft(promotion)) {
    return left(promotion.left)
  }

  if(promotion.right.items[0].id.toString() !== id) {
    return left( [new DataNotFoundException()] )
  }


  return right( promotion.right.items[0] )
}