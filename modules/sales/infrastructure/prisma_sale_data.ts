import { SaleDAO }             from "../domain/sale_dao"
import { Sale }                from "../domain/sale"
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
import { PrismaClient }        from "@prisma/client"
import {
  InfrastructureException
}                              from "../../shared/domain/exceptions/infrastructure_exception"
import * as changeCase         from "change-case"
import { Address }             from "../../address/domain/address"
import { Country }             from "../../country/domain/country"
import { Errors }              from "../../shared/domain/exceptions/errors"

export class PrismaSaleData implements SaleDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( sale: Sale ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.sale.create( {
        data: {
          id         : sale.id.toString(),
          description: sale.description.value,
          percentage : sale.percentage.value,
          startDate  : sale.startDate.value,
          endDate    : sale.endDate.value,
          isActive   : sale.isActive.value,
          createdAt  : sale.createdAt.toString(),
          productId  : sale.productId.toString()
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
      await this.db.sale.delete( {
        where: {
          id: id.toString()
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
    sortType?: ValidString ): Promise<Either<BaseException[], Sale[]>> {
    try {
      const where = {}
      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals: query.id.toString()
        }
      }
      if ( query.ids ) {
        const arr: string[] = query.ids.split( "," )
        const ids           = arr.map(
          i => UUID.from( i ).toString() )
        // @ts-ignore
        where["id"]         = {
          in: ids
        }
      }
      if ( query.name ) {
        // @ts-ignore
        where["name"] = {
          contains: query.name
        }
      }
      if ( query.names ) {
        const arr: string[] = query.names.split( "," )
        const names         = arr.map( i => ValidString.from( i ).value )
        // @ts-ignore
        where["name"]       = {
          in: names
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }
      const offset   = skip ? parseInt( skip.value ) : 0
      const response = await this.db.sale.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value,
      } )

      const result: Sale[] = []
      for ( const e of response ) {
        const mapped = Sale.fromPrimitives(
          e.id,
          e.description,
          e.percentage,
          e.startDate,
          e.endDate,
          e.isActive,
          e.productId,
          e.createdAt
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        result.push( mapped )
      }
      return right( result )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async update( sale: Sale ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.sale.update( {
        where: {
          id: sale.id.toString()
        },
        data : {
          percentage : sale.percentage.value,
          description: sale.description.value,
          startDate  : sale.startDate.value,
          endDate    : sale.endDate.value,
          isActive   : sale.isActive.value,
          productId  : sale.productId.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

}