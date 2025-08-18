import { Promotion }                 from "../domain/promotion"
import { PromotionDTO }              from "./promotion_dto"
import { PromotionProductMapper }    from "./promotion_product_mapper"
import {
  Errors
}                                    from "../../shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"
import {
  UUID
}                                    from "../../shared/domain/value_objects/uuid"
import {
  ValidString
}                                    from "../../shared/domain/value_objects/valid_string"
import {
  ValidPercentage
}                                    from "../../shared/domain/value_objects/valid_percentage"
import {
  ValidDate
}                                    from "../../shared/domain/value_objects/valid_date"
import {
  ValidBool
}                                    from "../../shared/domain/value_objects/valid_bool"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"
import { PromotionProduct }          from "../domain/promotion_product"

export class PromotionMapper {
  static toDTO( promotion: Promotion ): PromotionDTO {
    return {
      id         : promotion.id.toString(),
      name       : promotion.name.value,
      percentage : promotion.percentage.value,
      start_date : promotion.startDate.toString(),
      end_date   : promotion.endDate.toString(),
      is_active  : promotion.isActive.value,
      products   : promotion.products.map( PromotionProductMapper.toDTO ),
      created_at : promotion.createdAt.toString(),
      description: promotion.description?.value
    }
  }

  static fromJSON( json: Record<string, any> ): PromotionDTO | Errors {
    const errors = []
    const id     = wrapType( () => UUID.from( json.id ) )
    if ( id instanceof BaseException ) errors.push( id )

    const name = wrapType( () => ValidString.from( json.name ) )
    if ( name instanceof BaseException ) errors.push( name )

    const percentage = wrapType( () => ValidPercentage.from( json.percentage ) )
    if ( percentage instanceof BaseException ) errors.push( percentage )

    const startDate = wrapType( () => ValidDate.from( json.start_date ) )
    if ( startDate instanceof BaseException ) errors.push( startDate )

    const endDate = wrapType( () => ValidDate.from( json.end_date ) )
    if ( endDate instanceof BaseException ) errors.push( endDate )

    const isActive = wrapType( () => ValidBool.from( json.is_active ) )
    if ( isActive instanceof BaseException ) errors.push( isActive )

    const description = wrapTypeDefault( undefined,
      ( value ) => ValidString.from( value ), json.description )
    if ( description instanceof BaseException ) errors.push( description )

    const createdAt = wrapType( () => ValidDate.from( json.created_at ) )

    if ( createdAt instanceof BaseException ) errors.push( createdAt )

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id         : (
        id as UUID
      ).toString(),
      name       : (
        name as ValidString
      ).value,
      percentage : (
        percentage as ValidPercentage
      ).value,
      start_date : (
        startDate as ValidDate
      ).toString(),
      end_date   : (
        endDate as ValidDate
      ).toString(),
      is_active  : (
        isActive as ValidBool
      ).value,
      products   : json.products.map( PromotionProductMapper.fromJSON ),
      created_at : (
        createdAt as ValidDate
      ).toString(),
      description: description instanceof ValidString
        ? description.value
        : undefined
    }
  }

  static toDomain( json: Record<string, any> ): Promotion | Errors {
    const products: PromotionProduct[] = []

    for ( const product of json.products ) {
      const productMapped = PromotionProductMapper.toDomain( product )
      if ( productMapped instanceof Errors ) {
        return productMapped
      }
      products.push( productMapped )
    }

    return Promotion.fromPrimitives(
      json.id,
      json.name,
      json.percentage,
      json.start_date,
      json.end_date,
      json.is_active,
      products,
      json.created_at,
      json.description
    )
  }
}