import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { ShipmentDAO }                 from "../domain/shipment_dao"
import { ensureShipmentExist }         from "../utils/ensure_shipment_exist"

export class RemoveShipment {
  constructor( private readonly dao: ShipmentDAO ) {
  }
  async execute( id: string ): Promise<Either<BaseException[], boolean>>{
    const exist = await ensureShipmentExist( this.dao, id )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const result = await this.dao.remove( exist.right.id )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}