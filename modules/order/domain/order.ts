import { UUID }                      from "../../shared/domain/value_objects/uuid"
import { User }                      from "../../user/domain/user"
import {
  ValidDecimal
}                                    from "../../shared/domain/value_objects/valid_decimal"
import { OrderStatus }               from "./order_status"
import {
  ValidDate
}                                    from "../../shared/domain/value_objects/valid_date"
import { OrderItem }                 from "./order_item"
import {
  Errors
}                                    from "../../shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"

export class Order {
  private constructor(
    readonly id: UUID,
    readonly user: User,
    readonly total: ValidDecimal,
    readonly status: OrderStatus,
    readonly items: OrderItem[],
    readonly createdAt: ValidDate,
    readonly updatedAt ?: ValidDate
  )
  {
  }

  static create(
    id: string,
    user: User,
    total: number,
    status: string,
    items: OrderItem[],
    createdAt: Date | string,
    updatedAt ?: Date | string
  ): Order | Errors {
    return Order.fromPrimitives(
      id, user, total, status, items, createdAt, updatedAt
    )
  }

  static fromPrimitives(
    id: string,
    user: User,
    total: number,
    status: string,
    items: OrderItem[],
    createdAt: Date | string,
    updatedAt ?: Date | string
  ): Order | Errors {
    const errors = []

    const _id = wrapType( () => UUID.from( id ) )
    if ( _id instanceof BaseException ) errors.push( _id )

    const _total = wrapType( () => ValidDecimal.from( total ) )
    if ( _total instanceof BaseException ) errors.push( _total )

    const _status = wrapType( () => OrderStatus.from( status ) )
    if ( _status instanceof BaseException ) errors.push( _status )

    const _createdAt = wrapType( () => ValidDate.from( createdAt ) )
    if ( _createdAt instanceof BaseException ) errors.push( _createdAt )

    const _updatedAt = wrapTypeDefault( undefined, ( value ) => ValidDate.from( value ), updatedAt )
    if ( _updatedAt instanceof BaseException ) errors.push( _updatedAt )

    if ( errors.length > 0 ) return new Errors( errors )

    return new Order(
      _id as UUID,
      user as User,
      _total as ValidDecimal,
      _status as OrderStatus,
      items as OrderItem[],
      _createdAt as ValidDate,
      _updatedAt as ValidDate | undefined
    )
  }
}