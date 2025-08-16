import { PrismaClient }             from "@prisma/client"
import { type Either, left, right } from "fp-ts/Either"
import * as changeCase              from "change-case"
import {
  ValidInteger
}                                   from "../../shared/domain/value_objects/valid_integer"
import {
  ValidString
}                                   from "../../shared/domain/value_objects/valid_string"
import {
  BaseException
}                                   from "../../shared/domain/exceptions/base_exception"
import {
  UUID
}                                   from "../../shared/domain/value_objects/uuid"
import { Errors }                   from "../../shared/domain/exceptions/errors"
import {
  InfrastructureException
}                                   from "../../shared/domain/exceptions/infrastructure_exception"
import { AddressDAO }               from "../domain/address_dao"
import { Address }                  from "../domain/address"
import { Country }                  from "../../country/domain/country"

export class PrismaAddressData implements AddressDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], Address[]>> {
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
      const response = await this.db.address.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value,
        include: {
          country: true
        }
      } )

      const result: Address[] = []
      for ( const e of response ) {
        const country = e.country
        const c       = Country.fromPrimitives(
          country.id.toString(),
          country.name,
          country.code,
          country.createdAt
        )

        if ( c instanceof Errors ) {
          return left( c.values )
        }

        const mapped = Address.fromPrimitives(
          e.id,
          e.street,
          e.city,
          e.state,
          e.postalCode,
          c,
          e.isDefault,
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

  async add( userId: UUID,
    address: Address ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.address.create( {
        data: {
          id        : address.id.toString(),
          street    : address.street.value,
          city      : address.city.value,
          state     : address.state.value,
          postalCode: address.postalCode.value,
          countryId : address.country.id.toString(),
          userId    : userId.toString(),
          isDefault : address.isDefault.value,
          createdAt : address.createdAt.toString()
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
      await this.db.address.delete( {
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

  async update( role: Address ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.address.update( {
        where: {
          id: role.id.toString()
        },
        data : {
          street    : role.street.value,
          city      : role.city.value,
          state     : role.state.value,
          postalCode: role.postalCode.value,
          countryId : role.country.id.toString(),
          isDefault : role.isDefault.value
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }

  }
}
