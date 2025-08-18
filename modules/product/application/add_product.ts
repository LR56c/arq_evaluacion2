import { ProductDAO } from "../domain/product_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
} from "../../shared/domain/exceptions/base_exception"
import { ProductRequest } from "./product_request"
import { ensureProductExist } from "../utils/ensure_product_exist"
import { containError } from "../../shared/utils/contain_error"
import {
  DataNotFoundException
} from "../../shared/domain/exceptions/data_not_found_exception"
import { SearchUser } from "../../user/application/search_user"
import {
  SearchSale
} from "../../sales/application/search_sale"
import { Product } from "../domain/product"
import { Sale } from "../../sales/domain/sale"
import {
  Errors
} from "../../shared/domain/exceptions/errors"

export class AddProduct {
  constructor(
    private readonly dao: ProductDAO,
    private readonly searchUser: SearchUser,
    private readonly searchSale: SearchSale
  )
  {
  }

  async execute( product: ProductRequest ): Promise<Either<BaseException[], boolean>> {

    const userResult = await this.searchUser.execute(
      { id: product.seller_id }, 1 )

    if ( isLeft( userResult ) ) {
      return left( userResult.left )
    }

    let sale: Sale | undefined = undefined

    if ( product.sale_id ) {
      const saleResult = await this.searchSale.execute(
        { id: product.sale_id }, 1 )

      if ( isLeft( saleResult ) ) {
        return left( saleResult.left )
      }

      if ( saleResult.right.length === 0 ||
        saleResult.right[0].id.toString() !== product.sale_id )
      {
        return left( [new DataNotFoundException()] )
      }

      sale = saleResult.right[0]
    }

    const existResult = await ensureProductExist( this.dao, product.id )

    if ( isLeft( existResult ) ) {
      if ( !containError( existResult.left, new DataNotFoundException() ) ) {
        return left( existResult.left )
      }
    }

    const productToAdd = Product.create(
      product.id,
      product.name,
      product.description,
      product.price,
      product.stock,
      product.image_url,
      userResult.right.items[0],
      sale
    )

    if ( productToAdd instanceof Errors ) {
      return left( productToAdd.values )
    }

    const result = await this.dao.add( productToAdd )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}