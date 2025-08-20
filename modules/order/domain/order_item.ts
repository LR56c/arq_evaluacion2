import { Product }       from "../../product/domain/product"
import { ValidInteger }  from "../../shared/domain/value_objects/valid_integer"
import { Errors }        from "../../shared/domain/exceptions/errors"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { UUID }          from "../../shared/domain/value_objects/uuid"
import { wrapType }      from "../../shared/utils/wrap_type"
import { ValidDecimal }  from "../../shared/domain/value_objects/valid_decimal"

export class OrderItem {
  private constructor(
    readonly id: UUID,
    readonly priceAtPurchase : ValidDecimal,
    readonly product: Product,
    readonly quantity: ValidInteger
  )
  {
  }

  static create(
    id: string,
    priceAtPurchase: number,
    product: Product,
    quantity: number
  ): OrderItem | Errors {
    return OrderItem.fromPrimitives(
      id,
      priceAtPurchase,
      product,
      quantity
    )
  }

  static fromPrimitives(
    id: string,
    priceAtPurchase: number,
    product: Product,
    quantity: number
  ): OrderItem | Errors {
    const errors    = []

    const _id       = wrapType(()=>UUID.from( id ))
    if ( _id instanceof BaseException ) {
      errors.push( _id )
    }

    const _priceAtPurchase = wrapType(()=>ValidDecimal.from( priceAtPurchase ))

    if ( _priceAtPurchase instanceof BaseException ) {
      errors.push( _priceAtPurchase )
    }

    const _quantity = wrapType(()=>ValidInteger.from( quantity ))

    if ( _quantity instanceof BaseException ) {
      errors.push( _quantity )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new OrderItem(
      _id as UUID,
      _priceAtPurchase as ValidDecimal,
      product,
      _quantity as ValidInteger
    )
  }
}