import { UUID }                      from "../../shared/domain/value_objects/uuid"
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
import { PromotionProduct }          from "./promotion_product"
import {
  Errors
}                                    from "../../shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"

export class Promotion {
  private constructor(
    readonly id: UUID,
    readonly name: ValidString,
    readonly percentage: ValidPercentage,
    readonly startDate: ValidDate,
    readonly endDate: ValidDate,
    readonly isActive: ValidBool,
    readonly products: PromotionProduct[],
    readonly createdAt: ValidDate,
    readonly description?: ValidString
  )
  {
  }

  static create(
    id: string,
    name: string,
    percentage: number,
    startDate: Date | string,
    endDate: Date | string,
    isActive: boolean,
    products: PromotionProduct[],
    description?: string
  ): Promotion | Errors
  {
    return Promotion.fromPrimitives(
      id, name, percentage, startDate, endDate, isActive, products, new Date(),
      description
    )
  }

  static fromPrimitivesThrow(
    id: string,
    name: string,
    percentage: number,
    startDate: Date | string,
    endDate: Date | string,
    isActive: boolean,
    products: PromotionProduct[],
    createdAt: Date | string,
    description?: string
  ): Promotion
  {
    return new Promotion(
      UUID.from( id ),
      ValidString.from( name ),
      ValidPercentage.from( percentage ),
      ValidDate.from( startDate ),
      ValidDate.from( endDate ),
      ValidBool.from( isActive ),
      products,
      ValidDate.from( createdAt ),
      description ? ValidString.from( description ) : undefined
    )
  }

  static fromPrimitives(
    id: string,
    name: string,
    percentage: number,
    startDate: Date | string,
    endDate: Date | string,
    isActive: boolean,
    products: PromotionProduct[],
    createdAt: Date | string,
    description?: string
  ): Promotion | Errors {
    const errors = []

    const _id = wrapType( () => UUID.from( id ) )
    if ( _id instanceof Error ) errors.push( _id )

    const _name = wrapType( () => ValidString.from( name ) )
    if ( _name instanceof Error ) errors.push( _name )

    const _percentage = wrapType( () => ValidPercentage.from( percentage ) )
    if ( _percentage instanceof Error ) errors.push( _percentage )

    const _startDate = wrapType( () => ValidDate.from( startDate ) )
    if ( _startDate instanceof Error ) errors.push( _startDate )

    const _endDate = wrapType( () => ValidDate.from( endDate ) )
    if ( _endDate instanceof Error ) errors.push( _endDate )

    const _isActive = wrapType( () => ValidBool.from( isActive ) )
    if ( _isActive instanceof Error ) errors.push( _isActive )

    const _createdAt = wrapType( () => ValidDate.from( createdAt ) )
    if ( _createdAt instanceof Error ) errors.push( _createdAt )

    const _description = wrapTypeDefault( undefined,
      ( value ) => ValidString.from( value ), description )
    if ( _description instanceof Error ) errors.push( _description )

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Promotion(
      _id as UUID,
      _name as ValidString,
      _percentage as ValidPercentage,
      _startDate as ValidDate,
      _endDate as ValidDate,
      _isActive as ValidBool,
      products,
      _createdAt as ValidDate,
      _description as ValidString | undefined
    )
  }
}