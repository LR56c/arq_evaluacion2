import { Instrumentation } from "~~/modules/shared/domain/instrumentation"
import {
  BaseException
}                          from "~~/modules/shared/domain/exceptions/base_exception"

export class OrderInstrumentation {
  constructor( private readonly logger: Instrumentation ) {
  }

  async addOrderFailed( left: BaseException[] ) {
    await this.logger.error( "order.add",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async removeOrderFailed( left: BaseException[] ) {
    await this.logger.error( "order.remove",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async updateOrderFailed( left: BaseException[] ) {
    await this.logger.error( "order.update",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async searchOrderFailed( left: BaseException[] ) {
    await this.logger.error( "order.search",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }
}
