import { UUID }          from "../../shared/domain/value_objects/uuid"
import {
  ValidPercentage
}                        from "../../shared/domain/value_objects/valid_percentage"
import { ValidDate }     from "../../shared/domain/value_objects/valid_date"
import { ValidBool }     from "../../shared/domain/value_objects/valid_bool"
import { wrapType }      from "../../shared/utils/wrap_type"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { ValidString }   from "../../shared/domain/value_objects/valid_string"
import { Errors }        from "../../shared/domain/exceptions/errors"

export class Sale {
  constructor(
    readonly id: UUID,
    readonly description: ValidString,
    readonly percentage: ValidPercentage,
    readonly startDate: ValidDate,
    readonly endDate: ValidDate,
    readonly isActive: ValidBool,
    readonly createdAt: ValidDate,
    readonly productId: UUID
  )
  {
  }

  static create(
    id: string,
    description: string,
    percentage: number,
    startDate: Date | string,
    endDate: Date | string,
    isActive: boolean,
    productId: string
  ): Sale | Errors
  {
    return Sale.fromPrimitives(
      id, description, percentage, startDate, endDate, isActive, productId, new Date()
    )
  }

  static fromPrimitivesThrow(
    id: string,
    description: string,
    percentage: number,
    startDate: Date | string,
    endDate: Date | string,
    isActive: boolean,
    productId: string,
    createdAt: Date | string
  ): Sale
  {
    return new Sale(
      UUID.from( id ),
      ValidString.from( description ),
      ValidPercentage.from( percentage ),
      ValidDate.from( startDate ),
      ValidDate.from( endDate ),
      ValidBool.from( isActive ),
      ValidDate.from( createdAt ),
      UUID.from( productId )
    )
  }

  static fromPrimitives(
    id: string,
    description: string,
    percentage: number,
    startDate: Date | string,
    endDate: Date | string,
    isActive: boolean,
    productId: string,
    createdAt: Date | string
  ): Sale | Errors
  {
    const errors = []
    const _id    = wrapType( () => UUID.from( id ) )

    if ( _id instanceof BaseException ) {
      errors.push( _id )
    }

    const _description = wrapType( () => ValidString.from( description ) )

    if ( _description instanceof BaseException ) {
      errors.push( _description )
    }

    const _percentage = wrapType( () => ValidPercentage.from( percentage ) )

    if ( _percentage instanceof BaseException ) {
      errors.push( _percentage )
    }

    const _startDate = wrapType( () => ValidDate.from( startDate ) )

    if ( _startDate instanceof BaseException ) {
      errors.push( _startDate )
    }

    const _endDate = wrapType( () => ValidDate.from( endDate ) )

    if ( _endDate instanceof BaseException ) {
      errors.push( _endDate )
    }

    const _isActive = wrapType( () => ValidBool.from( isActive ) )

    if ( _isActive instanceof BaseException ) {
      errors.push( _isActive )
    }

    const _productId = wrapType( () => UUID.from( productId ) )

    if ( _productId instanceof BaseException ) {
      errors.push( _productId )
    }

    const _createdAt = wrapType( () => ValidDate.from( createdAt ) )

    if ( _createdAt instanceof BaseException ) {
      errors.push( _createdAt )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Sale(
      _id as UUID,
      _description as ValidString,
      _percentage as ValidPercentage,
      _startDate as ValidDate,
      _endDate as ValidDate,
      _isActive as ValidBool,
      _createdAt as ValidDate,
      _productId as UUID
    )
  }
}
