import { ShipmentDAO }                 from "../domain/shipment_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import { BaseException }               from "../../shared/domain/exceptions/base_exception"
import { ShipmentDTO }   from "./shipment_dto"
import { ensureShipmentExist } from "../utils/ensure_shipment_exist"
import { containError } from "../../shared/utils/contain_error"
import {
  DataNotFoundException
} from "../../shared/domain/exceptions/data_not_found_exception"
import { Shipment }             from "../domain/shipment"
import { Errors }               from "../../shared/domain/exceptions/errors"
import {
  SearchAddress
}                                      from "../../address/application/search_address"
import { SearchOrder } from "../../order/application/search_order"

export class AddShipment {
  constructor(
    private readonly dao: ShipmentDAO,
    private readonly searchAddress: SearchAddress,
    private readonly searchOrder: SearchOrder,
  ) {
  }

  async execute( dto: ShipmentDTO ): Promise<Either<BaseException[], boolean>> {
    const addressExist = await this.searchAddress.execute( { id: dto.address_id }, 1 )

    if ( isLeft( addressExist ) ) {
      return left( addressExist.left )
    }

    if ( addressExist.right.items.length === 0  || addressExist.right.items[0].id.toString() !== dto.address_id ) {
      return left( [new DataNotFoundException()] )
    }

    const orderExist = await this.searchOrder.execute( { id: dto.order_id }, 1 )

    if ( isLeft( orderExist ) ) {
      return left( orderExist.left )
    }

    if ( orderExist.right.items.length === 0  || orderExist.right.items[0].id.toString() !== dto.order_id ) {
      return left( [new DataNotFoundException()] )
    }

    const existResult = await ensureShipmentExist( this.dao, dto.id )

    if ( isLeft( existResult ) ) {
      if ( !containError( existResult.left, new DataNotFoundException() ) ) {
        return left( existResult.left )
      }
    }

    const shipment = Shipment.create(
      dto.id,
      dto.order_id,
      dto.address_id,
      dto.tracking_number,
      dto.pickup_date_time,
      dto.shipping_date_time,
      dto.delivery_date_time,
    )

    if ( shipment instanceof Errors ) {
      return left( shipment.values )
    }

    const result = await this.dao.add( shipment )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right(true)
  }
}