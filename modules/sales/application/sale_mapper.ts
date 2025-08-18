import { Sale }          from "../domain/sale"
import { SaleDTO }       from "./sale_dto"
import { UUID }          from "../../shared/domain/value_objects/uuid"
import { ValidString }   from "../../shared/domain/value_objects/valid_string"
import {
  ValidPercentage
}                        from "../../shared/domain/value_objects/valid_percentage"
import { ValidDate }     from "../../shared/domain/value_objects/valid_date"
import { ValidBool }     from "../../shared/domain/value_objects/valid_bool"
import { wrapType }      from "../../shared/utils/wrap_type"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { Errors }        from "../../shared/domain/exceptions/errors"

export class SaleMapper {
  static toDTO( sale: Sale ): SaleDTO {
    return {
      id         : sale.id.toString(),
      description: sale.description.value,
      percentage : sale.percentage.value,
      start_date : sale.startDate.toString(),
      end_date   : sale.endDate.toString(),
      is_active  : sale.isActive.value,
      created_at : sale.createdAt.toString(),
      product_id : sale.productId.toString()
    }
  }

  static toJSON( sale: SaleDTO ): Record<string, any> {
    return {
      id         : sale.id,
      description: sale.description,
      percentage : sale.percentage,
      start_date : sale.start_date,
      end_date   : sale.end_date,
      is_active  : sale.is_active,
      created_at : sale.created_at,
      product_id : sale.product_id
    }
  }

  static fromJSON( dto: Record<string, any> ): SaleDTO | Errors {
    const errors = []
    const id     = wrapType( () => UUID.from( dto.id ) )
    if ( id instanceof BaseException ) errors.push( id )

    const description = wrapType( () => ValidString.from( dto.description ) )
    if ( description instanceof BaseException ) errors.push( description )

    const percentage = wrapType( () => ValidPercentage.from( dto.percentage ) )
    if ( percentage instanceof BaseException ) errors.push( percentage )

    const startDate = wrapType( () => ValidDate.from( dto.start_date ) )
    if ( startDate instanceof BaseException ) errors.push( startDate )

    const endDate = wrapType( () => ValidDate.from( dto.end_date ) )
    if ( endDate instanceof BaseException ) errors.push( endDate )

    const isActive = wrapType( () => ValidBool.from( dto.is_active ) )
    if ( isActive instanceof BaseException ) errors.push( isActive )

    const createdAt = wrapType( () => ValidDate.from( dto.created_at ) )
    if ( createdAt instanceof BaseException ) errors.push( createdAt )

    const productId = wrapType( () => UUID.from( dto.product_id ) )
    if ( productId instanceof BaseException ) errors.push( productId )

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id         : (
        id as UUID
      ).toString(),
      description: (
        description as ValidString
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
      created_at : (
        createdAt as ValidDate
      ).toString(),
      product_id : (
        productId as UUID
      ).toString()
    }
  }

  static toDomain( json: Record<string, any> ): Sale | Errors {
    return Sale.fromPrimitives(
      json.id,
      json.description,
      json.percentage,
      json.start_date,
      json.end_date,
      json.is_active,
      json.product_id,
      json.created_at
    )
  }
}