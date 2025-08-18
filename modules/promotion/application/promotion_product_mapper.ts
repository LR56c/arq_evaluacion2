import { PromotionProduct }    from "../domain/promotion_product"
import { PromotionProductDTO } from "./promotion_product_dto"
import { ProductMapper }       from "../../product/application/product_mapper"
import { Errors }              from "../../shared/domain/exceptions/errors"
import { wrapType }            from "../../shared/utils/wrap_type"
import {
  BaseException
}                              from "../../shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                              from "../../shared/domain/value_objects/valid_integer"
import { Product }             from "../../product/domain/product"
import { ProductResponse }     from "../../product/application/product_response"

export class PromotionProductMapper {
  static toDTO(
    promotion: PromotionProduct
  ): PromotionProductDTO {
    return {
      product : ProductMapper.toResponse( promotion.product ),
      quantity: promotion.quantity.value
    }
  }

  static fromJSON( json: Record<string, any> ): PromotionProductDTO | Errors {
    const errors  = []
    const product = ProductMapper.fromJSON( json.product )
    if ( product instanceof Errors ) errors.push( ...product.values )

    const quantity = wrapType( () => ValidInteger.from( json.quantity ) )
    if ( quantity instanceof BaseException ) errors.push( quantity )

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      product : product as ProductResponse,
      quantity: (
        quantity as ValidInteger
      ).value
    }
  }

  static toDomain( json: Record<string, any> ): PromotionProduct | Errors {
    const product = ProductMapper.toDomain( json.product )
    if ( product instanceof Errors ) {
      return product
    }
    return PromotionProduct.fromPrimitives(
      product as Product,
      json.quantity
    )
  }
}