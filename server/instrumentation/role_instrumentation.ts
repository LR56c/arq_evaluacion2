import type { Instrumentation } from "~~/modules/shared/domain/instrumentation"
import type {
  BaseException
}                               from "~~/modules/shared/domain/exceptions/base_exception"

export class RoleInstrumentation {
  constructor( private readonly logger: Instrumentation ) {
  }

  async addRoleFailed( left: BaseException[] ) {
    await this.logger.error( "role.add",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async removeRoleFailed( left: BaseException[] ) {
    await this.logger.error( "role.remove",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async updateRoleFailed( left: BaseException[] ) {
    await this.logger.error( "role.update",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }

  async searchRoleFailed( left: BaseException[] ) {
    await this.logger.error( "role.search",
      { data: left.map( value => value.toPrimitivesFlatten() ) } )
  }
}
