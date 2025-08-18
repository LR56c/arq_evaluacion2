import { ProductResponse }      from "./product_response"
import { Product }              from "../domain/product"
import { SaleMapper }           from "../../sales/application/sale_mapper"
import { ProductAdminResponse } from "./product_admin_response"
import { UserMapper }           from "../../user/application/user_mapper"
import { Errors }               from "../../shared/domain/exceptions/errors"
import { wrapType }             from "../../shared/utils/wrap_type"
import { UUID }                 from "../../shared/domain/value_objects/uuid"
import {
  BaseException
}                               from "../../shared/domain/exceptions/base_exception"
import {
  ValidString
}                               from "../../shared/domain/value_objects/valid_string"
import {
  ValidInteger
}                               from "../../shared/domain/value_objects/valid_integer"
import {
  ValidURL
}                               from "../../shared/domain/value_objects/valid_url"
import { SaleDTO }              from "../../sales/application/sale_dto"
import { UserResponse }         from "../../user/application/user_response"

export class ProductMapper {
  static toResponse( product: Product ): ProductResponse {
    return {
      id         : product.id.toString(),
      name       : product.name.value,
      description: product.description.value,
      price      : product.price.value,
      stock      : product.stock.value,
      image_url  : product.imageUrl.value,
      sale       : SaleMapper.toDTO( product.sale )
    }
  }

  static toAdminResponse( product: Product ): ProductAdminResponse {
    return {
      id         : product.id.toString(),
      name       : product.name.value,
      description: product.description.value,
      price      : product.price.value,
      stock      : product.stock.value,
      image_url  : product.imageUrl.value,
      seller     : UserMapper.toResponse( product.seller ),
      sale       : SaleMapper.toDTO( product.sale ),
      created_at : product.createdAt.toString(),
      updated_at : product.updatedAt?.toString()
    }
  }

  static fromJSON( json: Record<string, any> ): ProductResponse | Errors {
    const errors = []
    const id     = wrapType( () => UUID.from( json.id ) )
    if ( id instanceof BaseException ) errors.push( id )

    const name = wrapType( () => ValidString.from( json.name ) )
    if ( name instanceof BaseException ) errors.push( name )

    const description = wrapType( () => ValidString.from( json.description ) )
    if ( description instanceof BaseException ) errors.push( description )

    const price = wrapType( () => ValidInteger.from( json.price ) )
    if ( price instanceof BaseException ) errors.push( price )

    const stock = wrapType( () => ValidInteger.from( json.stock ) )
    if ( stock instanceof BaseException ) errors.push( stock )

    const imageUrl = wrapType( () => ValidURL.from( json.image_url ) )
    if ( imageUrl instanceof BaseException ) errors.push( imageUrl )

    const sale = SaleMapper.fromJSON( json.sale )
    if ( sale instanceof Errors ) {
      errors.push( ...sale.values )
    }

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
      description: (
        description as ValidString
      ).value,
      price      : (
        price as ValidInteger
      ).value,
      stock      : (
        stock as ValidInteger
      ).value,
      image_url  : (
        imageUrl as ValidURL
      ).value,
      sale       : sale as SaleDTO
    }
  }

  static toDomain( json: Record<string, any> ): Product | Errors {
    const seller = UserMapper.toDomain( json.seller )
    if ( seller instanceof Errors ) {
      return seller
    }

    const sale = json.sale ? SaleMapper.toDomain( json.sale ) : undefined

    if ( sale instanceof Errors ) {
      return sale
    }

    return Product.fromPrimitives(
      json.id,
      json.name,
      json.description,
      json.price,
      json.stock,
      json.image_url,
      seller,
      json.created_at,
      json.updated_at,
      sale
    )
  }
}