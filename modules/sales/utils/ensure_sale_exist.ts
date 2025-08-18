import { AddressDAO } from "../../address/domain/address_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { Address } from "../../address/domain/address"
import { wrapType } from "../../shared/utils/wrap_type"
import { UUID } from "../../shared/domain/value_objects/uuid"
import {
  ValidInteger
} from "../../shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
} from "../../shared/domain/exceptions/data_not_found_exception"
import { SaleDAO }                     from "../domain/sale_dao"
import { Sale } from "../domain/sale"

export const ensureSaleExist = async ( dao : SaleDAO, id: string): Promise<Either<BaseException[], Sale>> => {
  const _id = wrapType(()=>UUID.from(id))

  if (_id instanceof BaseException) {
    return left( [_id] )
  }

  const sale = await dao.search(
    { id: _id.toString() }, ValidInteger.from(1))

  if (isLeft(sale)) {
    return left(sale.left)
  }

  if(sale.right[0].id.toString() !== id) {
    return left( [new DataNotFoundException()] )
  }


  return right( sale.right[0] )
}