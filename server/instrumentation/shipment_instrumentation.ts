import { Instrumentation } from "~~/modules/shared/domain/instrumentation"
import {
  BaseException
}                          from "~~/modules/shared/domain/exceptions/base_exception"

export class ShipmentInstrumentation {
  constructor( private readonly logger: Instrumentation ) {
  }

  async addShipmentFailed( left: BaseException[] ) {
    await this.logger.error( "shipment.add",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async removeShipmentFailed( left: BaseException[] ) {
    await this.logger.error( "shipment.remove",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async updateShipmentFailed( left: BaseException[] ) {
    await this.logger.error( "shipment.update",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async searchShipmentFailed( left: BaseException[] ) {
    await this.logger.error( "shipment.search",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }
}
