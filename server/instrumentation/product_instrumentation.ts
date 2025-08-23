import { Instrumentation } from "~~/modules/shared/domain/instrumentation"
import {
  BaseException
}                          from "~~/modules/shared/domain/exceptions/base_exception"

export class ProductInstrumentation {
  constructor( private readonly logger: Instrumentation ) {
  }

  async addProductFailed( left: BaseException[] ) {
    await this.logger.error( "product.add",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async removeProductFailed( left: BaseException[] ) {
    await this.logger.error( "product.remove",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async updateProductFailed( left: BaseException[] ) {
    await this.logger.error( "product.update",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async searchProductFailed( left: BaseException[] ) {
    await this.logger.error( "product.search",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }
}
