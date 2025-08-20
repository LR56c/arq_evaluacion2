import { UUID }                      from "../../shared/domain/value_objects/uuid"
import {
  ValidString
}                                    from "../../shared/domain/value_objects/valid_string"
import {
  ValidDate
}                                    from "../../shared/domain/value_objects/valid_date"
import {
  Errors
}                                    from "../../shared/domain/exceptions/errors"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"

export class Shipment {
  private constructor(
    readonly id: UUID,
    readonly orderId: UUID,
    readonly addressId: UUID,
    readonly trackingNumber: ValidString,
    readonly createdAt: ValidDate,
    readonly pickupDateTime ?: ValidDate,
    readonly shippingDateTime ?: ValidDate,
    readonly deliveryDateTime ?: ValidDate
  )
  {
  }

  static create(
    id: string,
    orderId: string,
    addressId: string,
    trackingNumber: string,
    pickupDateTime ?: Date | string,
    shippingDateTime ?: Date | string,
    deliveryDateTime ?: Date | string
  ): Shipment | Errors
  {
    return Shipment.fromPrimitives(
      id, orderId, addressId, trackingNumber, new Date(), pickupDateTime,
      shippingDateTime,
      deliveryDateTime
    )
  }

  static fromPrimitives(
    id: string,
    orderId: string,
    addressId: string,
    trackingNumber: string,
    createdAt: Date | string,
    pickupDateTime ?: Date | string,
    shippingDateTime ?: Date | string,
    deliveryDateTime ?: Date | string
  ): Shipment | Errors
  {
    const errors = []

    const _id = wrapType( () => UUID.from( id ) )
    if ( _id instanceof BaseException ) errors.push( _id )

    const _orderId = wrapType( () => UUID.from( orderId ) )
    if ( _orderId instanceof BaseException ) errors.push( _orderId )

    const _addressId = wrapType( () => UUID.from( addressId ) )
    if ( _addressId instanceof BaseException ) errors.push( _addressId )

    const _trackingNumber = wrapType( () => ValidString.from( trackingNumber ) )
    if ( _trackingNumber instanceof BaseException ) {
      errors.push(
        _trackingNumber )
    }

    const _pickupDateTime = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), pickupDateTime )
    if ( _pickupDateTime instanceof BaseException ) {
      errors.push(
        _pickupDateTime )
    }

    const _shippingDateTime = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), shippingDateTime )
    if ( _shippingDateTime instanceof BaseException ) {
      errors.push(
        _shippingDateTime )
    }

    const _deliveryDateTime = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), deliveryDateTime )
    if ( _deliveryDateTime instanceof BaseException ) {
      errors.push(
        _deliveryDateTime )
    }

    const _createdAt = wrapType( () => ValidDate.from( createdAt ) )
    if ( _createdAt instanceof BaseException ) {
      errors.push( _createdAt )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Shipment(
      _id as UUID,
      _orderId as UUID,
      _addressId as UUID,
      _trackingNumber as ValidString,
      _createdAt as ValidDate,
      _pickupDateTime as ValidDate | undefined,
      _shippingDateTime as ValidDate | undefined,
      _deliveryDateTime as ValidDate | undefined
    )
  }

  static fromPrimitivesThrow(
    id: string,
    orderId: string,
    addressId: string,
    trackingNumber: string,
    createdAt: Date | string,
    pickupDateTime ?: Date | string,
    shippingDateTime ?: Date | string,
    deliveryDateTime ?: Date | string
  ): Shipment
  {
    return new Shipment(
      UUID.from( id ),
      UUID.from( orderId ),
      UUID.from( addressId ),
      ValidString.from( trackingNumber ),
      ValidDate.from( createdAt ),
      pickupDateTime ? ValidDate.from( pickupDateTime ) : undefined,
      shippingDateTime ? ValidDate.from( shippingDateTime ) : undefined,
      deliveryDateTime ? ValidDate.from( deliveryDateTime ) : undefined
    )
  }
}