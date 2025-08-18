import { UUID }                      from "../../shared/domain/value_objects/uuid"
import {
  ValidString
}                                    from "../../shared/domain/value_objects/valid_string"
import {
  ValidInteger
}                                    from "../../shared/domain/value_objects/valid_integer"
import {
  ValidURL
}                                    from "../../shared/domain/value_objects/valid_url"
import {
  ValidDate
}                                    from "../../shared/domain/value_objects/valid_date"
import { Sale }                      from "../../sales/domain/sale"
import {
  Errors
}                                    from "../../shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"
import { User }                      from "../../user/domain/user"

export class Product {
  constructor(
    readonly id: UUID,
    readonly name: ValidString,
    readonly description: ValidString,
    readonly price: ValidInteger,
    readonly stock: ValidInteger,
    readonly imageUrl: ValidURL,
    readonly seller: User,
    readonly createdAt: ValidDate,
    readonly updatedAt?: ValidDate,
    readonly sale?: Sale
  )
  {
  }

  static create(
    id: string,
    name: string,
    description: string,
    price: number,
    stock: number,
    imageUrl: string,
    seller: User,
    sale?: Sale
  )
  {
    return Product.fromPrimitives(
      id, name, description, price, stock, imageUrl, seller,
      new Date(), undefined, sale
    )
  }

  static fromPrimitivesThrow(
    id: string,
    name: string,
    description: string,
    price: number,
    stock: number,
    imageUrl: string,
    seller: User,
    createdAt: Date | string,
    updatedAt?: Date | string,
    sale?: Sale
  ): Product {
    return new Product(
      UUID.from( id ),
      ValidString.from( name ),
      ValidString.from( description ),
      ValidInteger.from( price ),
      ValidInteger.from( stock ),
      ValidURL.from( imageUrl ),
      seller,
      ValidDate.from( createdAt ),
      updatedAt ? ValidDate.from( updatedAt ) : undefined,
      sale
    )
  }

  static fromPrimitives(
    id: string,
    name: string,
    description: string,
    price: number,
    stock: number,
    imageUrl: string,
    seller: User,
    createdAt: Date | string,
    updatedAt?: Date | string,
    sale?: Sale
  ): Product | Errors {
    const errors = []
    const _id    = wrapType( () => UUID.from( id ) )

    if ( _id instanceof BaseException ) {
      errors.push( _id )
    }

    const _name = wrapType( () => ValidString.from( name ) )

    if ( _name instanceof BaseException ) {
      errors.push( _name )
    }

    const _description = wrapType( () => ValidString.from( description ) )
    if ( _description instanceof BaseException ) {
      errors.push( _description )
    }

    const _price = wrapType( () => ValidInteger.from( price ) )
    if ( _price instanceof BaseException ) {
      errors.push( _price )
    }

    const _stock = wrapType( () => ValidInteger.from( stock ) )
    if ( _stock instanceof BaseException ) {
      errors.push( _stock )
    }

    const _imageUrl = wrapType( () => ValidURL.from( imageUrl ) )
    if ( _imageUrl instanceof BaseException ) {
      errors.push( _imageUrl )
    }

    const _createdAt = wrapType( () => ValidDate.from( createdAt ) )
    if ( _createdAt instanceof BaseException ) {
      errors.push( _createdAt )
    }

    const _updatedAt = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), updatedAt )
    if ( _updatedAt instanceof BaseException ) {
      errors.push( _updatedAt )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Product(
      _id as UUID,
      _name as ValidString,
      _description as ValidString,
      _price as ValidInteger,
      _stock as ValidInteger,
      _imageUrl as ValidURL,
      seller,
      _createdAt as ValidDate,
      _updatedAt as ValidDate | undefined,
      sale
    )
  }
}
