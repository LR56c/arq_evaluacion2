import { SaleDAO } from "../domain/sale_dao"
import {
  SearchProduct
} from "../../product/application/search_product"
import { Sale } from "../domain/sale"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
} from "../../shared/domain/exceptions/base_exception"
import { SaleDTO } from "./sale_dto"
import { ensureSaleExist } from "../utils/ensure_sale_exist"
import { SaleUpdateDTO } from "./sale_update_dto"
import {
  Errors
} from "../../shared/domain/exceptions/errors"

export class UpdateSale {
  constructor(
    private readonly dao: SaleDAO
  )
  {
  }

  async execute( sale: SaleUpdateDTO ): Promise<Either<BaseException[], boolean>> {

    const existResult = await ensureSaleExist( this.dao, sale.id )

    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    const saleToUpdate = Sale.fromPrimitives(
      existResult.right.id.toString(),
      sale.description ? sale.description : existResult.right.description.value,
      sale.percentage ? sale.percentage : existResult.right.percentage.value,
      sale.start_date
        ? sale.start_date
        : existResult.right.startDate.toString(),
      sale.end_date ? sale.end_date : existResult.right.endDate.toString(),
      sale.is_active ? sale.is_active : existResult.right.isActive.value,
      sale.product_id
        ? sale.product_id
        : existResult.right.productId.toString(),
      existResult.right.createdAt.toString()
    )

    if ( saleToUpdate instanceof Errors ) {
      return left( saleToUpdate.values )
    }

    const updateResult = await this.dao.update( saleToUpdate )

    if ( isLeft( updateResult ) ) {
      return left( [updateResult.left] )
    }

    return right( true )
  }

}