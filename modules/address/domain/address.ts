import { UUID }          from "../../shared/domain/value_objects/uuid"
import { ValidString }   from "../../shared/domain/value_objects/valid_string"
import { ValidBool }     from "../../shared/domain/value_objects/valid_bool"
import { Country }       from "../../country/domain/country"
import { Errors }        from "../../shared/domain/exceptions/errors"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { wrapType }      from "../../shared/utils/wrap_type"
import { ValidDate }     from "../../shared/domain/value_objects/valid_date"

export class Address {
  private constructor(
    readonly id: UUID,
    readonly street: ValidString,
    readonly city: ValidString,
    readonly state: ValidString,
    readonly postalCode: ValidString,
    readonly country: Country,
    readonly isDefault: ValidBool,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    street: string,
    city: string,
    state: string,
    postalCode: string,
    country: Country,
    isDefault: boolean
  ): Address | Errors {
    return Address.fromPrimitives(
      id, street, city, state, postalCode, country, isDefault, new Date()
    )
  }

  static fromPrimitivesThrow(
    id: string,
    street: string,
    city: string,
    state: string,
    postalCode: string,
    country: Country,
    isDefault: boolean,
    createdAt: Date | string
  ): Address {
    return new Address(
      UUID.from( id ),
      ValidString.from( street ),
      ValidString.from( city ),
      ValidString.from( state ),
      ValidString.from( postalCode ),
      country,
      ValidBool.from( isDefault ),
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    street: string,
    city: string,
    state: string,
    postalCode: string,
    country: Country,
    isDefault: boolean,
    createdAt: Date | string
  ): Address | Errors {
    const errors = []

    const _id = wrapType( () => UUID.from( id ) )

    if ( _id instanceof BaseException ) {
      errors.push( _id )
    }

    const _street = wrapType( () => ValidString.from( street ) )

    if ( _street instanceof BaseException ) {
      errors.push( _street )
    }

    const _city = wrapType( () => ValidString.from( city ) )

    if ( _city instanceof BaseException ) {
      errors.push( _city )
    }

    const _state = wrapType( () => ValidString.from( state ) )

    if ( _state instanceof BaseException ) {
      errors.push( _state )
    }

    const _postalCode = wrapType( () => ValidString.from( postalCode ) )


    if ( _postalCode instanceof BaseException ) {
      errors.push( _postalCode )
    }

    const _isDefault = wrapType( () => ValidBool.from( isDefault ) )

    if ( _isDefault instanceof BaseException ) {
      errors.push( _isDefault )
    }

    const _createdAt = wrapType( () => ValidDate.from( createdAt ) )

    if ( _createdAt instanceof BaseException ) {
      errors.push( _createdAt )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Address(
      _id as UUID,
      _street as ValidString,
      _city as ValidString,
      _state as ValidString,
      _postalCode as ValidString,
      country,
      _isDefault as ValidBool,
      _createdAt as ValidDate
    )
  }
}