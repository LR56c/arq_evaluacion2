import { AddressDAO }                  from "../domain/address_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { AddressDTO }           from "./address_dto"
import { ensureAddressExist }   from "../utils/ensure_address_exist"
import { AddressUpdateDTO }     from "./address_update_dto"
import { Address }              from "../domain/address"
import { Errors }               from "../../shared/domain/exceptions/errors"
import { SearchCountry }        from "../../country/application/search_country"

export class UpdateAddress {
  constructor(
    private readonly dao: AddressDAO,
    private readonly searchCountry: SearchCountry
  )
  {
  }

  async execute( address: AddressUpdateDTO ): Promise<Either<BaseException[], boolean>> {
    const existResult = await ensureAddressExist( this.dao, address.id )

    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    let country = existResult.right.country

    if ( address.country ) {
      const countryResult = await this.searchCountry.execute(
        { name: address.country.name }, 1
      )

      if ( isLeft( countryResult ) ) {
        return left( countryResult.left )
      }
      country = countryResult.right[0]
    }

    const addressToUpdate = Address.fromPrimitives(
      address.id ?? existResult.right.id.toString(),
      address.street ?? existResult.right.street.value,
      address.city ?? existResult.right.city.value,
      address.state ?? existResult.right.state.value,
      address.postal_code ?? existResult.right.postalCode.value,
      country,
      address.is_default ?? existResult.right.isDefault.value,
      existResult.right.createdAt.toString()
    )

    if ( addressToUpdate instanceof Errors ) {
      return left( addressToUpdate.values )
    }

    const result = await this.dao.update( addressToUpdate )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}