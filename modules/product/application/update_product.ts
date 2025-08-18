import { ProductDAO } from "../domain/product_dao"
import { SearchUser } from "../../user/application/search_user"
import {
  SearchSale
} from "../../sales/application/search_sale"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
} from "../../shared/domain/exceptions/base_exception"
import { ProductAdminUpdateDTO } from "./product_admin_update_dto"
import { ensureProductExist } from "../utils/ensure_product_exist"
import {
  InfrastructureException
} from "../../shared/domain/exceptions/infrastructure_exception"
import { Product } from "../domain/product"
import {
  Errors
} from "../../shared/domain/exceptions/errors"

export class UpdateProduct {
  constructor(
    private readonly dao: ProductDAO,
    private readonly searchUser: SearchUser,
    private readonly searchSale: SearchSale
  )
  {
  }

  async execute( product: ProductAdminUpdateDTO ): Promise<Either<BaseException[], boolean>> {


    const existResult = await ensureProductExist( this.dao, product.id )

    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    let seller = existResult.right.seller
    if ( product.seller_id ) {
      const userResult = await this.searchUser.execute(
        { id: product.seller_id }, 1 )
      if ( isLeft( userResult ) ) {
        return left( userResult.left )
      }
      if ( userResult.right.items.length === 0 ||
        userResult.right.items[0].id.toString() !== product.seller_id )
      {
        return left( [new InfrastructureException( "User not found" )] )
      }
      seller = userResult.right.items[0]
    }

    let sale = existResult.right.sale
    if ( product.sale_id ) {
      const saleResult = await this.searchSale.execute(
        { id: product.sale_id }, 1 )
      if ( isLeft( saleResult ) ) {
        return left( saleResult.left )
      }
      if ( saleResult.right.length === 0 ||
        saleResult.right[0].id.toString() !== product.sale_id )
      {
        return left( [new InfrastructureException( "Sale not found" )] )
      }
      sale = saleResult.right[0]
    }

    const productToUpdate = Product.fromPrimitives(
      existResult.right.id.toString(),
      product.name ? product.name : existResult.right.name.value,
      product.description
        ? product.description
        : existResult.right.description.value,
      product.price ? product.price : existResult.right.price.value,
      product.stock ? product.stock : existResult.right.stock.value,
      product.image_url ? product.image_url : existResult.right.imageUrl.value,
      seller,
      existResult.right.createdAt.toString(),
      new Date().toISOString(),
      sale
    )

    if ( productToUpdate instanceof Errors ) {
      return left( productToUpdate.values )
    }

    const result = await this.dao.update( productToUpdate )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}