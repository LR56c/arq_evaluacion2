import { ShipmentDTO }               from "./shipment_dto"
import { Shipment }                  from "../domain/shipment"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"
import {
  UUID
}                                    from "../../shared/domain/value_objects/uuid"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"
import {
  ValidString
}                                    from "../../shared/domain/value_objects/valid_string"
import {
  Errors
}                                    from "../../shared/domain/exceptions/errors"
import {
  ValidDate
}                                    from "../../shared/domain/value_objects/valid_date"

export class ShipmentMapper {
  static toDTO( shipment: Shipment ): ShipmentDTO {
    return {
      id                : shipment.id.toString(),
      order_id          : shipment.orderId.toString(),
      address_id        : shipment.addressId.toString(),
      tracking_number   : shipment.trackingNumber.toString(),
      pickup_date_time  : shipment.pickupDateTime?.toString(),
      shipping_date_time: shipment.shippingDateTime?.toString(),
      delivery_date_time: shipment.deliveryDateTime?.toString()
    }
  }

  static fromJSON( json: Record<string, any> ): ShipmentDTO | Errors {
    const errors = []
    const id     = wrapType( () => UUID.from( json.id ) )
    if ( id instanceof BaseException ) errors.push( id )

    const orderId = wrapType( () => UUID.from( json.order_id ) )
    if ( orderId instanceof BaseException ) errors.push( orderId )

    const addressId = wrapType( () => UUID.from( json.address_id ) )
    if ( addressId instanceof BaseException ) errors.push( addressId )

    const trackingNumber = wrapType(
      () => ValidString.from( json.tracking_number ) )
    if ( trackingNumber instanceof BaseException ) errors.push( trackingNumber )

    const pickupDateTime = wrapTypeDefault( undefined,
      ( value ) => ValidString.from( value ), json.pickup_date_time )
    if ( pickupDateTime instanceof BaseException ) errors.push( pickupDateTime )

    const shippingDateTime = wrapTypeDefault( undefined,
      ( value ) => ValidString.from( value ), json.shipping_date_time )
    if ( shippingDateTime instanceof BaseException ) {
      errors.push(
        shippingDateTime )
    }

    const deliveryDateTime = wrapTypeDefault( undefined,
      ( value ) => ValidString.from( value ), json.delivery_date_time )
    if ( deliveryDateTime instanceof BaseException ) {
      errors.push(
        deliveryDateTime )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id                : (
        id as UUID
      ).toString(),
      order_id          : (
        orderId as UUID
      ).toString(),
      address_id        : (
        addressId as UUID
      ).toString(),
      tracking_number   : (
        trackingNumber as ValidString
      ).value,
      pickup_date_time  : pickupDateTime instanceof ValidDate
        ? pickupDateTime.toString()
        : undefined,
      shipping_date_time: shippingDateTime instanceof ValidDate
        ? shippingDateTime.toString()
        : undefined,
      delivery_date_time: deliveryDateTime instanceof ValidDate
        ? deliveryDateTime.toString()
        : undefined
    }
  }

  static toDomain( json: Record<string, any> ): Shipment | Errors {
    return Shipment.fromPrimitives(
      json.id,
      json.order_id,
      json.address_id,
      json.tracking_number,
      json.pickup_date_time,
      json.shipping_date_time,
      json.delivery_date_time
    )
  }
}