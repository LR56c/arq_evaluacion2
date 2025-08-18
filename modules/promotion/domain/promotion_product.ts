import { Product }       from "../../product/domain/product"
import { ValidInteger }  from "../../shared/domain/value_objects/valid_integer"
import { Errors }        from "../../shared/domain/exceptions/errors"
import { BaseException } from "../../shared/domain/exceptions/base_exception"

export class PromotionProduct {
  private constructor(
    readonly product: Product,
    readonly quantity: ValidInteger
  )
  {
  }

  static create(
    product: Product,
    quantity: number
  ): PromotionProduct | Errors {
    return PromotionProduct.fromPrimitives(
      product,
      quantity
    )
  }

  static fromPrimitives(
    product: Product,
    quantity: number
  ): PromotionProduct | Errors {
    const errors    = []
    const _quantity = ValidInteger.from( quantity )

    if ( _quantity instanceof BaseException ) {
      errors.push( _quantity )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new PromotionProduct(
      product,
      _quantity as ValidInteger
    )
  }


}