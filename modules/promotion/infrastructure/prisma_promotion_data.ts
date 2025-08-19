import { PromotionDAO }        from "../domain/promotion_dao"
import { PrismaClient }        from "@prisma/client"
import { Promotion }           from "../domain/promotion"
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
import * as changeCase         from "change-case"
import { User }                from "../../user/domain/user"
import { Role }                from "../../role/domain/role"
import { Errors }              from "../../shared/domain/exceptions/errors"
import {
  InfrastructureException
}                              from "../../shared/domain/exceptions/infrastructure_exception"
import { Product }             from "../../product/domain/product"
import { PromotionProduct }    from "../domain/promotion_product"
import { Sale }                from "../../sales/domain/sale"

export class PrismaPromotionData implements PromotionDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( promotion: Promotion ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.promotion.create( {
          data: {
            id         : promotion.id.toString(),
            name       : promotion.name.value,
            percentage : promotion.percentage.value,
            startDate  : promotion.startDate.toString(),
            endDate    : promotion.endDate.toString(),
            isActive   : promotion.isActive.value,
            createdAt  : promotion.createdAt.toString(),
            description: promotion.description?.value
          }
        } ),
        this.db.promotionProduct.createMany( {
          data: promotion.products.map( p => (
            {
              promotionId: promotion.id.toString(),
              quantity   : p.quantity.value,
              productId  : p.product.id.toString()
            }
          ) )
        } )
      ] )
      return right( true )
    }
    catch ( error ) {
      return right( false )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.promotionProduct.deleteMany( {
          where: {
            promotionId: id.toString()
          }
        } ),
        this.db.promotion.delete( {
          where: {
            id: id.toString()
          }
        } )
      ] )
      return right( true )
    }
    catch ( error ) {
      return right( false )
    }
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<Promotion>>> {
    try {
      let where = {}
      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals: query.id
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }

      const offset                  = skip ? parseInt( skip.value ) : 0
      const results                 = await this.db.$transaction( [
        this.db.promotion.findMany( {
          where  : where,
          orderBy: orderBy,
          skip   : offset,
          take   : limit?.value,
          include: {
            products: {
              include: {
                product: {
                  include: {
                    seller: true,
                    sale  : true
                  }
                }
              }
            }
          }
        } ),
        this.db.promotion.count( {
          where: where
        } )
      ] )
      const [response, total]       = results
      const promotions: Promotion[] = []
      for ( const e of response ) {
        const products: PromotionProduct[] = []
        for ( const pp of e.products ) {
          const p              = pp.product
          const u              = p.seller
          const sellerMetadata = JSON.parse( u.metadata )
          const seller         = User.fromPrimitives(
            u.id.toString(),
            u.name,
            u.email,
            sellerMetadata,
            [],
            u.createdAt.toString(),
            u.updatedAt.toString()
          )

          if ( seller instanceof Errors ) {
            return left( seller.values )
          }

          let s: Sale | undefined = undefined

          if ( p.sale ) {
            const sale = Sale.fromPrimitives(
              p.sale.id.toString(),
              p.sale.description,
              p.sale.percentage,
              p.sale.startDate,
              p.sale.endDate,
              p.sale.isActive,
              p.sale.productId,
              p.sale.createdAt.toString()
            )
            if ( sale instanceof Errors ) {
              return left( sale.values )
            }

            s = sale
          }

          const product = Product.fromPrimitives(
            p.id.toString(),
            p.name,
            p.description,
            p.price,
            p.stock,
            p.imageUrl,
            seller,
            p.createdAt.toString(),
            p.updatedAt?.toString(),
            s
          )

          if ( product instanceof Errors ) {
            return left( product.values )
          }

          const promotionProduct = PromotionProduct.fromPrimitives(
            product,
            pp.quantity
          )

          if ( promotionProduct instanceof Errors ) {
            return left( promotionProduct.values )
          }
          products.push( promotionProduct )
        }
        const result = Promotion.fromPrimitives(
          e.id.toString(),
          e.name,
          e.percentage,
          e.startDate,
          e.endDate,
          e.isActive,
          products,
          e.createdAt,
          e.description
        )

        if ( result instanceof Errors ) {
          return left( result.values )
        }
        promotions.push( result )
      }
      return right( {
        items: promotions,
        total: total
      } )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }

  }

  async update( promotion: Promotion ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.promotion.update( {
          where: {
            id: promotion.id.toString()
          },
          data : {
            name       : promotion.name.value,
            percentage : promotion.percentage.value,
            startDate  : promotion.startDate.toString(),
            endDate    : promotion.endDate.toString(),
            isActive   : promotion.isActive.value,
            createdAt  : promotion.createdAt.toString(),
            description: promotion.description?.value
          }
        } ),
        this.db.promotionProduct.deleteMany( {
          where: {
            promotionId: promotion.id.toString()
          }
        } ),
        this.db.promotionProduct.createMany( {
          data: promotion.products.map( p => (
            {
              promotionId: promotion.id.toString(),
              quantity   : p.quantity.value,
              productId  : p.product.id.toString()
            }
          ) )
        } )
      ] )
      return right( true )
    }
    catch ( error ) {
      return right( false )
    }
  }


}