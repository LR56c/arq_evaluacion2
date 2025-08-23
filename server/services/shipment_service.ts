import type { Either }         from "fp-ts/Either"
import { isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "~~/modules/shared/domain/exceptions/base_exception"
import type {
  PaginatedResult
}                              from "~~/modules/shared/domain/paginated_result"
import {
  AddShipment
}                              from "~~/modules/shipment/application/add_shipment"
import {
  RemoveShipment
}                              from "~~/modules/shipment/application/remove_shipment"
import {
  SearchShipment
}                              from "~~/modules/shipment/application/search_shipment"
import {
  UpdateShipment
}                              from "~~/modules/shipment/application/update_shipment"
import {
  ShipmentInstrumentation
}                              from "~~/server/instrumentation/shipment_instrumentation"
import {
  ShipmentDTO
}                              from "~~/modules/shipment/application/shipment_dto"
import {
  ShipmentMapper
}                              from "~~/modules/shipment/application/shipment_mapper"
import {
  ShipmentUpdateDTO
}                              from "~~/modules/shipment/application/shipment_update_dto"

export class ShipmentService {
  constructor(
    private readonly addShipment: AddShipment,
    private readonly removeShipment: RemoveShipment,
    private readonly searchShipment: SearchShipment,
    private readonly updateShipment: UpdateShipment,
    private readonly instrumentation: ShipmentInstrumentation
  )
  {
  }

  async add(dto: ShipmentDTO ): Promise<Either<BaseException[], boolean>> {
    const result = await this.addShipment.execute( dto )
    if ( isLeft( result ) ) {
      await this.instrumentation.addShipmentFailed( result.left )
    }
    return right( true )
  }

  async remove( id: string ): Promise<Either<BaseException[], boolean>> {
    const result = await this.removeShipment.execute( id )
    if ( isLeft( result ) ) {
      await this.instrumentation.removeShipmentFailed( result.left )
    }
    return right( true )
  }

  async search( query: Record<string, any>, limit ?: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<ShipmentDTO>>> {
    const result = await this.searchShipment.execute( query, limit, skip, sortBy,
      sortType )

    if ( isLeft( result ) ) {
      await this.instrumentation.searchShipmentFailed( result.left )
      return left( result.left )
    }

    return right( {
      total: result.right.total,
      items: result.right.items.map( ShipmentMapper.toDTO )
    } )
  }

  async update( dto: ShipmentUpdateDTO ): Promise<Either<BaseException[], boolean>> {
    const result = await this.updateShipment.execute( dto )
    if ( isLeft( result ) ) {
      await this.instrumentation.updateShipmentFailed( result.left )
    }
    return right( true )
  }
}
