import type { Either }         from "fp-ts/Either"
import { isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "~~/modules/shared/domain/exceptions/base_exception"
import type {
  AddAddress
}                              from "~~/modules/address/application/add_address"
import type {
  RemoveAddress
}                              from "~~/modules/address/application/remove_address"
import type {
  SearchAddress
}                              from "~~/modules/address/application/search_address"
import type {
  UpdateAddress
}                              from "~~/modules/address/application/update_address"
import type {
  AddressInstrumentation
}                              from "~~/server/instrumentation/address_instrumentation"
import type {
  AddressDTO
}                              from "~~/modules/address/application/address_dto"
import {
  AddressMapper
}                              from "~~/modules/address/application/address_mapper"
import type {
  PaginatedResult
}                              from "~~/modules/shared/domain/paginated_result"
import type {
  AddressUpdateDTO
}                              from "~~/modules/address/application/address_update_dto"

export class AddressService {
  constructor(
    private readonly addAddress: AddAddress,
    private readonly removeAddress: RemoveAddress,
    private readonly searchAddress: SearchAddress,
    private readonly updateAddress: UpdateAddress,
    private readonly instrumentation: AddressInstrumentation
  )
  {
  }

  async add( userId: string,
    dto: AddressDTO ): Promise<Either<BaseException[], boolean>> {
    const result = await this.addAddress.execute( userId, dto )
    if ( isLeft( result ) ) {
      await this.instrumentation.addAddressFailed( result.left )
    }
    return right( true )
  }

  async remove( id: string ): Promise<Either<BaseException[], boolean>> {
    const result = await this.removeAddress.execute( id )
    if ( isLeft( result ) ) {
      await this.instrumentation.removeAddressFailed( result.left )
    }
    return right( true )
  }

  async search( query: Record<string, any>, limit ?: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<AddressDTO>>> {
    const result = await this.searchAddress.execute( query, limit, skip, sortBy,
      sortType )

    if ( isLeft( result ) ) {
      await this.instrumentation.searchAddressFailed( result.left )
      return left( result.left )
    }

    return right( {
      total: result.right.total,
      items: result.right.items.map( AddressMapper.toDTO )
    } )
  }

  async update( dto: AddressUpdateDTO ): Promise<Either<BaseException[], boolean>> {
    const result = await this.updateAddress.execute( dto )
    if ( isLeft( result ) ) {
      await this.instrumentation.updateAddressFailed( result.left )
    }
    return right( true )
  }
}
