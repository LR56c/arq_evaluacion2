import { ShipmentDAO }         from "../domain/shipment_dao"
import { Shipment }            from "../domain/shipment"
import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "../../shared/domain/exceptions/base_exception"
import { UUID }                from "../../shared/domain/value_objects/uuid"
import {
  ValidInteger
}                              from "../../shared/domain/value_objects/valid_integer"
import {
  ValidString
}                              from "../../shared/domain/value_objects/valid_string"
import { PaginatedResult }     from "../../shared/domain/paginated_result"
import { PrismaClient }        from "@prisma/client"
import {
  InfrastructureException
}                              from "../../shared/domain/exceptions/infrastructure_exception"
import * as changeCase         from "change-case"
import { Errors }              from "../../shared/domain/exceptions/errors"

export class PrismaShipmentData implements ShipmentDAO {

  constructor( private readonly db: PrismaClient ) {
  }

  async add( shipment: Shipment ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.shipment.create( {
        data: {
          id              : shipment.id.value,
          orderId         : shipment.orderId.value,
          addressId       : shipment.addressId.value,
          trackingNumber  : shipment.trackingNumber.value,
          pickupDateTime  : shipment.pickupDateTime.toString(),
          shippingDateTime: shipment.shippingDateTime.toString(),
          deliveryDateTime: shipment.deliveryDateTime.toString(),
          createdAt       : shipment.createdAt.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.shipment.delete( {
        where: {
          id: id.value
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<Shipment>>> {
    try {
      const where = {}
      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals: query.id.toString()
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }
      const offset            = skip ? parseInt( skip.value ) : 0
      const results           = await this.db.$transaction( [
        this.db.shipment.findMany( {
          where  : where,
          orderBy: orderBy,
          skip   : offset,
          take   : limit?.value
        } ),
        this.db.shipment.count( {
          where: where
        } )
      ] )
      const [response, total] = results

      const result: Shipment[] = []
      for ( const e of response ) {
        const mapped = Shipment.fromPrimitives(
          e.id,
          e.orderId,
          e.addressId,
          e.trackingNumber,
          e.pickupDateTime,
          e.shippingDateTime,
          e.deliveryDateTime
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        result.push( mapped )
      }
      return right( {
        items: result,
        total: total
      } )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }

  }

  async update( shipment: Shipment ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.shipment.update( {
        where: {
          id: shipment.id.value
        },
        data : {
          orderId         : shipment.orderId.value,
          addressId       : shipment.addressId.value,
          trackingNumber  : shipment.trackingNumber.value,
          pickupDateTime  : shipment.pickupDateTime.toString(),
          shippingDateTime: shipment.shippingDateTime.toString(),
          deliveryDateTime: shipment.deliveryDateTime.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

}