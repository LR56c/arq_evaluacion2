import { SaleDAO } from "../domain/sale_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
} from "../../shared/domain/exceptions/base_exception"
import { ensureSaleExist } from "../utils/ensure_sale_exist"

export class RemoveSale {
  constructor( private readonly dao: SaleDAO ) {
  }

  async execute( id: string ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensureSaleExist( this.dao, id )

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