import type { Either }         from "fp-ts/Either"
import { isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "~~/modules/shared/domain/exceptions/base_exception"
import {
  SearchCountry
}                              from "~~/modules/country/application/search_country"
import {
  CountryInstrumentation
}                              from "~~/server/instrumentation/country_instrumentation"
import {
  CountryMapper
}                              from "~~/modules/country/application/country_mapper"
import {
  CountryDTO
}                              from "~~/modules/country/application/country_dto"

export class CountryService {
  constructor(
    private readonly searchCountry: SearchCountry,
    private readonly instrumentation: CountryInstrumentation
  )
  {
  }

  async search( query: Record<string, any>, limit?: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], CountryDTO[]>> {
    const result = await this.searchCountry.execute( query, limit, skip, sortBy,
      sortType )

    if ( isLeft( result ) ) {
      await this.instrumentation.searchError( result.left )
      return left( result.left )
    }

    const response = result.right.map(
      country => CountryMapper.toDTO( country ) )
    return right( response )
  }
}
