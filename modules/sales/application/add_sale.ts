import { SaleDAO }                     from "../domain/sale_dao"
import { Sale }                        from "../domain/sale"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { SaleDTO }                     from "./sale_dto"
import { containError }                from "../../shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "../../shared/domain/exceptions/data_not_found_exception"
import { ensureSaleExist }             from "../utils/ensure_sale_exist"
import {
  SearchProduct
}                                      from "../../product/application/search_product"
import {
  Errors
}                                      from "../../shared/domain/exceptions/errors"

export class AddSale {
  constructor(
    private readonly dao: SaleDAO,
    private readonly searchProduct: SearchProduct
  )
  {
  }

  async execute( sale: SaleDTO ): Promise<Either<BaseException[], boolean>> {

    const existProduct = await this.searchProduct.execute( {
      id: sale.product_id
    }, 1 )

    if ( isLeft( existProduct ) ) {
      return left( existProduct.left )
    }

    if ( existProduct.right.items.length === 0 ||
      existProduct.right.items[0].id.toString() !== sale.product_id )
    {
      return left( [new DataNotFoundException()] )
    }

    const existResult = await ensureSaleExist( this.dao, sale.id )

    if ( isLeft( existResult ) ) {
      if ( !containError( existResult.left, new DataNotFoundException() ) ) {
        return left( existResult.left )
      }
    }

    const saleToAdd = Sale.fromPrimitives(
      sale.id,
      sale.description,
      sale.percentage,
      sale.start_date,
      sale.end_date,
      sale.is_active,
      sale.created_at,
      sale.product_id
    )

    if ( saleToAdd instanceof Errors ) {
      return left( saleToAdd.values )
    }

    const result = await this.dao.add( saleToAdd )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}