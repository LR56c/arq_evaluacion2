import { ProductDAO }          from "../domain/product_dao"
import { Product }             from "../domain/product"
import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "../../shared/domain/exceptions/base_exception"
import { UUID }                from "../../shared/domain/value_objects/uuid"
import {
  ValidInteger
}                              from "../../shared/domain/value_objects/valid_integer"
import {
  ValidString
}                              from "../../shared/domain/value_objects/valid_string"
import { PaginatedResult }     from "../../shared/domain/paginated_result"
import { PrismaClient }        from "@prisma/client"
import {
  InfrastructureException
}                              from "../../shared/domain/exceptions/infrastructure_exception"
import * as changeCase         from "change-case"
import { Errors }              from "../../shared/domain/exceptions/errors"
import { User }                from "../../user/domain/user"
import { Sale }                from "../../sales/domain/sale"

export class PrismaProductData implements ProductDAO {

  constructor( private readonly db: PrismaClient ) {
  }

  async add( product: Product ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.product.create( {
        data: {
          id         : product.id.toString(),
          name       : product.name.value,
          description: product.description.value,
          price      : product.price.value,
          stock      : product.stock.value,
          imageUrl   : product.imageUrl.value,
          createdAt  : product.createdAt.toString(),
          updatedAt  : product.updatedAt?.toString(),
          saleId     : product.sale ? product.sale.id.toString() : null,
          sellerId   : product.seller.id.toString()
        }
      } )
      return right( true )
    }
    catch ( error ) {
      return left( new InfrastructureException() )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.product.delete( {
        where: {
          id: id.toString()
        }
      } )
      return right( true )
    }
    catch ( error ) {
      return left( new InfrastructureException() )
    }
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<Product>>> {
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
      const offset  = skip ? parseInt( skip.value ) : 0
      const results = await this.db.$transaction( [
        this.db.product.findMany( {
          where  : where,
          orderBy: orderBy,
          skip   : offset,
          take   : limit?.value,
          include: {
            seller: true,
            sale  : true
          }
        } ),
        this.db.user.count( {
          where: where
        } )
      ] )
      const [response, total] = results
      const result: Product[] = []
      for ( const e of response ) {
        const sellerDb       = e.seller
        const sellerMetadata = JSON.parse( sellerDb.metadata )
        const seller         = User.fromPrimitives(
          sellerDb.id.toString(),
          sellerDb.name,
          sellerDb.email,
          sellerMetadata,
          [],
          sellerDb.createdAt.toString(),
          sellerDb.updatedAt?.toString()
        )
        if ( seller instanceof Errors ) {
          return left( seller.values )
        }
        let sale: Sale | undefined = undefined
        if ( e.sale ) {
          const saleMapped = Sale.fromPrimitives(
            e.sale.id.toString(),
            e.sale.description,
            e.sale.percentage,
            e.sale.startDate.toString(),
            e.sale.endDate.toString(),
            e.sale.isActive,
            e.sale.createdAt.toString(),
            e.sale.productId.toString()
          )

          if ( saleMapped instanceof Errors ) {
            return left( saleMapped.values )
          }
          sale = saleMapped
        }
        const mapped = Product.fromPrimitives(
          e.id,
          e.name,
          e.description,
          e.price,
          e.stock,
          e.imageUrl,
          seller as User,
          e.createdAt,
          e.updatedAt,
          sale
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        result.push( mapped )
      }
      return right( {
        items: result,
        total: total
      } )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }

  }

  async update( product: Product ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.product.update( {
        where: {
          id: product.id.toString()
        },
        data : {
          name       : product.name.value,
          description: product.description.value,
          price      : product.price.value,
          stock      : product.stock.value,
          imageUrl   : product.imageUrl.value,
          updatedAt  : product.updatedAt?.toString(),
          saleId     : product.sale ? product.sale.id.toString() : null,
          sellerId   : product.seller.id.toString()
        }
      } )
      return right( true )
    }
    catch ( error ) {
      return left( new InfrastructureException() )
    }
  }

}