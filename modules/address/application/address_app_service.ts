import { AddressDTO }  from "./address_dto"

export abstract class AddressDTOAppService {
  abstract add( userId: string,
    address: AddressDTO ): Promise<void>

  abstract update( address: AddressDTO ): Promise<void>

  abstract remove( id: string ): Promise<void>

  abstract search(queryUrl: string): Promise<AddressDTO[]>
}
