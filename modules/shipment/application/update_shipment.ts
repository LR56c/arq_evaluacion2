import { ShipmentDAO } from "../domain/shipment_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
} from "../../shared/domain/exceptions/base_exception"
import { ShipmentUpdateDTO } from "./shipment_update_dto"
import { ensureShipmentExist } from "../utils/ensure_shipment_exist"
import {
  SearchAddress
} from "../../address/application/search_address"
import {
  SearchOrder
} from "../../order/application/search_order"
import {
  DataNotFoundException
} from "../../shared/domain/exceptions/data_not_found_exception"
import { Shipment } from "../domain/shipment"
import {
  Errors
} from "../../shared/domain/exceptions/errors"

export class UpdateShipment {
  constructor(
    private readonly dao: ShipmentDAO,
    private readonly searchAddress: SearchAddress,
    private readonly searchOrder: SearchOrder
  )
  {
  }

  async execute( dto: ShipmentUpdateDTO ): Promise<Either<BaseException[], boolean>> {
    const existResult = await ensureShipmentExist( this.dao, dto.id )

    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    let addressId = existResult.right.addressId.toString()
    if ( dto.address_id ) {
      const addressExist = await this.searchAddress.execute(
        { id: dto.address_id }, 1 )

      if ( isLeft( addressExist ) ) {
        return left( addressExist.left )
      }

      if ( addressExist.right.items.length === 0 ||
        addressExist.right.items[0].id.toString() !== dto.address_id )
      {
        return left( [new DataNotFoundException()] )
      }
      addressId = dto.address_id
    }

    let orderId = existResult.right.orderId.toString()
    if ( dto.order_id ) {
      const orderExist = await this.searchOrder.execute( { id: dto.order_id },
        1 )

      if ( isLeft( orderExist ) ) {
        return left( orderExist.left )
      }

      if ( orderExist.right.items.length === 0 ||
        orderExist.right.items[0].id.toString() !== dto.order_id )
      {
        return left( [new DataNotFoundException()] )
      }
      orderId = dto.order_id
    }

    const shipment = Shipment.fromPrimitives(
      existResult.right.id.toString(),
      orderId,
      addressId,
      dto.tracking_number ?? existResult.right.trackingNumber.value,
      existResult.right.createdAt.toString(),
      dto.pickup_date_time ?? existResult.right.pickupDateTime?.toString(),
      dto.shipping_date_time ?? existResult.right.shippingDateTime?.toString(),
      dto.delivery_date_time ?? existResult.right.deliveryDateTime?.toString()
    )

    if ( shipment instanceof Errors ) {
      return left( shipment.values )
    }

    const result = await this.dao.update( shipment )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}