import { Instrumentation } from "~~/modules/shared/domain/instrumentation"
import {
  BaseException
}                          from "~~/modules/shared/domain/exceptions/base_exception"

export class PromotionInstrumentation {
  constructor( private readonly logger: Instrumentation ) {
  }

  async addPromotionFailed( left: BaseException[] ) {
    await this.logger.error( "promotion.add",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async removePromotionFailed( left: BaseException[] ) {
    await this.logger.error( "promotion.remove",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async updatePromotionFailed( left: BaseException[] ) {
    await this.logger.error( "promotion.update",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async searchPromotionFailed( left: BaseException[] ) {
    await this.logger.error( "promotion.search",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }
}
