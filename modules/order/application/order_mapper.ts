import { Order }           from "../domain/order"
import { OrderDTO }        from "./order_dto"
import { UserMapper }      from "../../user/application/user_mapper"
import { OrderItemMapper } from "./order_item_mapper"
import { Errors }          from "../../shared/domain/exceptions/errors"
import { UUID }            from "../../shared/domain/value_objects/uuid"
import { wrapType }        from "../../shared/utils/wrap_type"
import {
  ValidDecimal
}                          from "../../shared/domain/value_objects/valid_decimal"
import { OrderStatus }     from "../domain/order_status"
import { BaseException }   from "../../shared/domain/exceptions/base_exception"
import { ValidDate }       from "../../shared/domain/value_objects/valid_date"
import { UserResponse }    from "../../user/application/user_response"
import { OrderItemDTO }    from "./order_item_dto"
import { OrderItem }       from "../domain/order_item"
import { User }            from "../../user/domain/user"

export class OrderMapper {
  static toDTO( order: Order ): OrderDTO {
    return {
      id        : order.id.toString(),
      user      : UserMapper.toResponse( order.user ),
      total     : order.total.value,
      status    : order.status.value,
      items     : order.items.map( item => OrderItemMapper.toDTO( item ) ),
      created_at: order.createdAt.toString()
    }
  }

  static fromJSON( json: Record<string, any> ): OrderDTO | Errors {
    const errors = []

    const id = wrapType( () => UUID.from( json.id ) )
    if ( id instanceof BaseException ) errors.push( id )

    const items: OrderItemDTO[] = []
    for ( const item of json.items ) {
      const mapped = OrderItemMapper.fromJSON( item )
      if ( mapped instanceof Errors ) {
        errors.push( ...mapped.values )
      }
      else {
        items.push( mapped as OrderItemDTO )
      }
    }

    const user = UserMapper.fromJSON( json.user )
    if ( user instanceof Errors ) errors.push( ...user.values )

    const total = wrapType( () => ValidDecimal.from( json.total ) )
    if ( total instanceof BaseException ) errors.push( total )

    const status = wrapType( () => OrderStatus.from( json.status ) )
    if ( status instanceof BaseException ) errors.push( status )

    const createdAt = wrapType( () => ValidDate.from( json.created_at ) )
    if ( createdAt instanceof BaseException ) errors.push( createdAt )

    if ( errors ) {
      return new Errors( errors )
    }

    return {
      id        : (
        id as UUID
      ).toString(),
      user      : user as UserResponse,
      total     : (
        total as ValidDecimal
      ).value,
      status    : (
        status as OrderStatus
      ).value,
      items     : items,
      created_at: (
        createdAt as ValidDate
      ).toString()
    }
  }

  static toDomain( json: Record<string, any> ): Order | Errors {
    const user = UserMapper.toDomain( json.user )
    if ( user instanceof Errors ) {
      return user
    }

    const items: OrderItem[] = []
    for ( const item of json.items ) {
      const mapped = OrderItemMapper.toDomain( item )
      if ( mapped instanceof Errors ) {
        return mapped
      }
      items.push( mapped as OrderItem )
    }

    return Order.fromPrimitives(
      json.id,
      user as User,
      json.total,
      json.status,
      items,
      json.created_at,
      json.updated_at
    )
  }
}