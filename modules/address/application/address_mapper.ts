import { Address }       from "../domain/address"
import { AddressDTO }    from "./address_dto"
import { CountryMapper } from "../../country/application/country_mapper"
import { Errors }        from "../../shared/domain/exceptions/errors"
import { Country }       from "../../country/domain/country"
import { wrapType }      from "../../shared/utils/wrap_type"
import { UUID }          from "../../shared/domain/value_objects/uuid"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { ValidString }   from "../../shared/domain/value_objects/valid_string"
import { ValidBool }     from "../../shared/domain/value_objects/valid_bool"
import { CountryDTO }    from "../../country/application/country_dto"
import { ValidDate }     from "../../shared/domain/value_objects/valid_date"

export class AddressMapper {
  static toDTO( address: Address ): AddressDTO {
    return {
      id         : address.id.toString(),
      street     : address.street.value,
      city       : address.city.value,
      state      : address.state.value,
      postal_code: address.postalCode.value,
      country    : CountryMapper.toDTO( address.country ),
      is_default : address.isDefault.value,
      created_at : address.createdAt.toString()
    }
  }

  static toJSON( address: AddressDTO ): Record<string, any> {
    return {
      id         : address.id,
      street     : address.street,
      city       : address.city,
      state      : address.state,
      postal_code: address.postal_code,
      country    : CountryMapper.toJSON( address.country ),
      is_default : address.is_default,
      created_at : address.created_at
    }
  }

  static fromJSON( address: Record<string, any> ): AddressDTO | Errors {
    const errors = []
    const id     = wrapType(
      () => UUID.from( address.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const street = wrapType(
      () => ValidString.from( address.street ) )

    if ( street instanceof BaseException ) {
      errors.push( street )
    }

    const city = wrapType(
      () => ValidString.from( address.city ) )

    if ( city instanceof BaseException ) {
      errors.push( city )
    }

    const state = wrapType(
      () => ValidString.from( address.state ) )

    if ( state instanceof BaseException ) {
      errors.push( state )
    }

    const postalCode = wrapType(
      () => ValidString.from( address.postal_code ) )

    if ( postalCode instanceof BaseException ) {
      errors.push( postalCode )
    }

    const country = CountryMapper.fromJSON( address.country )
    if ( country instanceof Errors ) {
      errors.push( ...country.values )
    }

    const isDefault = wrapType(
      () => ValidBool.from( address.is_default ) )

    if ( isDefault instanceof BaseException ) {
      errors.push( isDefault )
    }

    const createdAt = wrapType(
      () => ValidDate.from( address.created_at ) )

    if ( createdAt instanceof BaseException ) {
      errors.push( createdAt )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id         : (
        id as UUID
      ).toString(),
      street     : (
        street as ValidString
      ).value,
      city       : (
        city as ValidString
      ).value,
      state      : (
        state as ValidString
      ).value,
      postal_code: (
        postalCode as ValidString
      ).value,
      country    : country as CountryDTO,
      is_default : (
        isDefault as ValidBool
      ).value,
      created_at : (
        createdAt as ValidDate
      ).toString()
    }
  }

  static toDomain( json: Record<string, any> ): Address | Errors {
    const country = CountryMapper.toDomain( json.country )
    if ( country instanceof Errors ) {
      return country
    }
    return Address.fromPrimitives(
      json.id,
      json.street,
      json.city,
      json.state,
      json.postal_code,
      country as Country,
      json.is_default,
      json.created_at
    )
  }
}