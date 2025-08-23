import { Instrumentation } from "~~/modules/shared/domain/instrumentation"
import {
  BaseException
}                          from "~~/modules/shared/domain/exceptions/base_exception"

export class SaleInstrumentation {
  constructor( private readonly logger: Instrumentation ) {
  }

  async addSaleFailed( left: BaseException[] ) {
    await this.logger.error( "sale.add",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async removeSaleFailed( left: BaseException[] ) {
    await this.logger.error( "sale.remove",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async updateSaleFailed( left: BaseException[] ) {
    await this.logger.error( "sale.update",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async searchSaleFailed( left: BaseException[] ) {
    await this.logger.error( "sale.search",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }
}
