import { Instrumentation } from "~~/modules/shared/domain/instrumentation"
import {
  BaseException
}                          from "~~/modules/shared/domain/exceptions/base_exception"

export class CountryInstrumentation {
  constructor( private readonly logger: Instrumentation ) {
  }

  async searchError( left: BaseException[] ) {
    await this.logger.error( "country.search",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }
}
