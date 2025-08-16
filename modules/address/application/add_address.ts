import { AddressDAO } from "../domain/address_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
} from "../../shared/domain/exceptions/base_exception"
import { AddressDTO } from "./address_dto"
import { ensureAddressExist } from "../utils/ensure_address_exist"
import { containError } from "../../shared/utils/contain_error"
import {
  DataNotFoundException
} from "../../shared/domain/exceptions/data_not_found_exception"
import { Address } from "../domain/address"
import { Country } from "../../country/domain/country"
import {
  UUID
} from "../../shared/domain/value_objects/uuid"
import { wrapType } from "../../shared/utils/wrap_type"
import {
  Errors
} from "../../shared/domain/exceptions/errors"
import {
  SearchCountry
} from "../../country/application/search_country"
import { SearchUser } from "../../user/application/search_user"

export class AddAddress {
  constructor( private readonly dao: AddressDAO,
    private readonly searchCountry: SearchCountry,
    private readonly searchUser: SearchUser
  )
  {
  }

  async add( userId: string,
    address: AddressDTO ): Promise<Either<BaseException[], boolean>> {

    const userResult = await this.searchUser.execute(
      { id: userId }, 1 )

    if ( isLeft( userResult ) ) {
      return left( userResult.left )
    }

    if ( userResult.right.items.length === 0 || userResult.right.items[0].id.toString() !== userId ) {
      return left( [new DataNotFoundException()] )
    }

    const existResult = await ensureAddressExist( this.dao, address.id )

    if ( isLeft( existResult ) ) {
      if ( !containError( existResult.left, new DataNotFoundException() ) ) {
        return left( existResult.left )
      }
    }

    const countryResult = await this.searchCountry.execute(
      { name: address.country.name }, 1 )

    if( isLeft( countryResult ) ) {
      return left( countryResult.left )
    }
    const country = countryResult.right[0]

    const _userID = wrapType( () => UUID.from( userId ) )

    if ( _userID instanceof BaseException ) {
      return left( [_userID] )
    }

    const newAddress = Address.create(
      address.id,
      address.street,
      address.city,
      address.state,
      address.postal_code,
      country as Country,
      address.is_default
    )

    if ( newAddress instanceof Errors ) {
      return left( newAddress.values )
    }

    const result = await this.dao.add( _userID, newAddress as Address )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}