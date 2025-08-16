import { Country }         from "../domain/country"
import { type CountryDTO } from "./country_dto"
import { Errors }          from "../../shared/domain/exceptions/errors"
import { wrapType }        from "../../shared/utils/wrap_type"
import { BaseException }   from "../../shared/domain/exceptions/base_exception"
import { ValidString }     from "../../shared/domain/value_objects/valid_string"
import { UUID }            from "../../shared/domain/value_objects/uuid"

export class CountryMapper {
  static toDTO( country: Country ): CountryDTO {
    return {
      id  : country.id.toString(),
      name: country.name.value,
      code: country.code.value
    }
  }

  static toJSON( country: CountryDTO ): Record<string, any> {
    return {
      id  : country.id,
      name: country.name,
      code: country.code
    }
  }

  static fromJSON( country: Record<string, any> ): CountryDTO | Errors {
    const errors = []
    const id     = wrapType(
      () => UUID.from( country.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const name = wrapType(
      () => ValidString.from( country.name ) )

    if ( name instanceof BaseException ) {
      errors.push( name )
    }

    const code = wrapType(
      () => ValidString.from( country.code ) )

    if ( code instanceof BaseException ) {
      errors.push( code )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id  : (
        id as UUID
      ).toString(),
      name: (
        name as ValidString
      ).value,
      code: (
        code as ValidString
      ).value
    }
  }

  static toDomain( json: Record<string, any> ): Country | Errors {
    return Country.fromPrimitives(
      json.id,
      json.name,
      json.code,
      json.created_at
    )
  }
}
