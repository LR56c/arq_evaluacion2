import { Instrumentation } from "~~/modules/shared/domain/instrumentation"
import {
  BaseException
}                          from "~~/modules/shared/domain/exceptions/base_exception"

export class AddressInstrumentation {
  constructor( private readonly logger: Instrumentation ) {
  }

  async addAddressFailed( left: BaseException[] ) {
    await this.logger.error( "address.add",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async removeAddressFailed( left: BaseException[] ) {
    await this.logger.error( "address.remove",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async updateAddressFailed( left: BaseException[] ) {
    await this.logger.error( "address.update",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async searchAddressFailed( left: BaseException[] ) {
    await this.logger.error( "address.search",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }
}
