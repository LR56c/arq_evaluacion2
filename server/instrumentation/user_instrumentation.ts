import { Instrumentation } from "~~/modules/shared/domain/instrumentation"
import {
  BaseException
}                          from "~~/modules/shared/domain/exceptions/base_exception"

export class UserInstrumentation {
  constructor( private readonly logger: Instrumentation ) {
  }

  async removeUserFailedFailed( left: BaseException[] ) {
    await this.logger.error( "user.remove",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async updateUserFailed( left: BaseException[] ) {
    await this.logger.error( "user.update",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async addUserFailed( left: BaseException[] ) {
    await this.logger.error( "user.add",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async searchUserFailed( left: BaseException[] ) {
    await this.logger.error( "user.search",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async getUserFailed( left: BaseException[] ) {
    await this.logger.error( "user.get",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }
}
