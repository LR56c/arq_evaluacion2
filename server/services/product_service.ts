import type { Either }         from "fp-ts/Either"
import { isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "~~/modules/shared/domain/exceptions/base_exception"
import type {
  PaginatedResult
}                              from "~~/modules/shared/domain/paginated_result"
import {
  AddProduct
}                              from "~~/modules/product/application/add_product"
import {
  RemoveProduct
}                              from "~~/modules/product/application/remove_product"
import {
  SearchProduct
}                              from "~~/modules/product/application/search_product"
import {
  UpdateProduct
}                              from "~~/modules/product/application/update_product"
import {
  ProductInstrumentation
}                              from "~~/server/instrumentation/product_instrumentation"
import {
  ProductRequest
}                              from "~~/modules/product/application/product_request"
import {
  ProductResponse
}                              from "~~/modules/product/application/product_response"
import {
  ProductMapper
}                              from "~~/modules/product/application/product_mapper"
import {
  ProductAdminUpdateDTO
}                              from "~~/modules/product/application/product_admin_update_dto"

export class ProductService {
  constructor(
    private readonly addProduct: AddProduct,
    private readonly removeProduct: RemoveProduct,
    private readonly searchProduct: SearchProduct,
    private readonly updateProduct: UpdateProduct,
    private readonly instrumentation: ProductInstrumentation
  )
  {
  }

  async add( dto: ProductRequest ): Promise<Either<BaseException[], boolean>> {
    const result = await this.addProduct.execute( dto )
    if ( isLeft( result ) ) {
      await this.instrumentation.addProductFailed( result.left )
    }
    return right( true )
  }

  async remove( id: string ): Promise<Either<BaseException[], boolean>> {
    const result = await this.removeProduct.execute( id )
    if ( isLeft( result ) ) {
      await this.instrumentation.removeProductFailed( result.left )
    }
    return right( true )
  }

  async search( query: Record<string, any>, limit ?: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<ProductResponse>>> {
    const result = await this.searchProduct.execute( query, limit, skip, sortBy,
      sortType )

    if ( isLeft( result ) ) {
      await this.instrumentation.searchProductFailed( result.left )
      return left( result.left )
    }

    return right( {
      total: result.right.total,
      items: result.right.items.map( ProductMapper.toResponse )
    } )
  }

  async update( dto: ProductAdminUpdateDTO ): Promise<Either<BaseException[], boolean>> {
    const result = await this.updateProduct.execute( dto )
    if ( isLeft( result ) ) {
      await this.instrumentation.updateProductFailed( result.left )
    }
    return right( true )
  }
}
