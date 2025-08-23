import type { Either }          from "fp-ts/Either"
import { isLeft, left, right }  from "fp-ts/Either"
import {
  BaseException
}                               from "~~/modules/shared/domain/exceptions/base_exception"
import type { PaginatedResult } from "~~/modules/shared/domain/paginated_result"
import { AddSale }              from "~~/modules/sales/application/add_sale"
import { RemoveSale }           from "~~/modules/sales/application/remove_sale"
import { SearchSale }           from "~~/modules/sales/application/search_sale"
import { UpdateSale }           from "~~/modules/sales/application/update_sale"
import {
  SaleInstrumentation
}                               from "~~/server/instrumentation/sale_instrumentation"
import { SaleDTO }              from "~~/modules/sales/application/sale_dto"
import { SaleMapper }           from "~~/modules/sales/application/sale_mapper"
import {
  SaleUpdateDTO
}                               from "~~/modules/sales/application/sale_update_dto"

export class SaleService {
  constructor(
    private readonly addSale: AddSale,
    private readonly removeSale: RemoveSale,
    private readonly searchSale: SearchSale,
    private readonly updateSale: UpdateSale,
    private readonly instrumentation: SaleInstrumentation
  )
  {
  }

  async add( dto: SaleDTO ): Promise<Either<BaseException[], boolean>> {
    const result = await this.addSale.execute( dto )
    if ( isLeft( result ) ) {
      await this.instrumentation.addSaleFailed( result.left )
    }
    return right( true )
  }

  async remove( id: string ): Promise<Either<BaseException[], boolean>> {
    const result = await this.removeSale.execute( id )
    if ( isLeft( result ) ) {
      await this.instrumentation.removeSaleFailed( result.left )
    }
    return right( true )
  }

  async search( query: Record<string, any>, limit ?: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<SaleDTO>>> {
    const result = await this.searchSale.execute( query, limit, skip, sortBy,
      sortType )

    if ( isLeft( result ) ) {
      await this.instrumentation.searchSaleFailed( result.left )
      return left( result.left )
    }

    return right( {
      total: result.right.total,
      items: result.right.items.map( SaleMapper.toDTO )
    } )
  }

  async update( dto: SaleUpdateDTO ): Promise<Either<BaseException[], boolean>> {
    const result = await this.updateSale.execute( dto )
    if ( isLeft( result ) ) {
      await this.instrumentation.updateSaleFailed( result.left )
    }
    return right( true )
  }
}
