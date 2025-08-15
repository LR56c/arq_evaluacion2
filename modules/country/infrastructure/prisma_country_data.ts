import { PrismaClient }             from "@prisma/client"
import { type Either, left, right } from "fp-ts/Either"
import * as changeCase              from "change-case"
import { CountryDAO }               from "../domain/country_dao"
import {
  ValidInteger
}                                   from "../../shared/domain/value_objects/valid_integer"
import {
  ValidString
}                                   from "../../shared/domain/value_objects/valid_string"
import {
  BaseException
}                                   from "../../shared/domain/exceptions/base_exception"
import { Country }                  from "../domain/country"
import { Errors }                   from "../../shared/domain/exceptions/errors"
import {
  InfrastructureException
}                                   from "../../shared/domain/exceptions/infrastructure_exception"

export class PrismaCountryData implements CountryDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], Country[]>> {
    try {
      const where = {}
      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals: query.id
        }
      }
      if ( query.name ) {
        // @ts-ignore
        where["name"] = {
          contains: query.name
        }
      }
      if ( query.code ) {
        // @ts-ignore
        where["code"] = {
          equals: query.code
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }
      const offset               = skip ? parseInt( skip.value ) : 0
      const response             = await this.db.country.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value
      } )
      const countries: Country[] = []
      for ( const country of response ) {
        const mapped = Country.fromPrimitives(
          country.id.toString(),
          country.name,
          country.code,
          country.createdAt
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        countries.push( mapped )
      }
      return right( countries )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

}
