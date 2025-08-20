import { OrderDAO }                    from "../domain/order_dao"
import { Order }                       from "../domain/order"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import {
  UUID
}                                      from "../../shared/domain/value_objects/uuid"
import {
  ValidInteger
}                                      from "../../shared/domain/value_objects/valid_integer"
import {
  ValidString
}                                      from "../../shared/domain/value_objects/valid_string"
import {
  PaginatedResult
}                                      from "../../shared/domain/paginated_result"
import { PrismaClient }                from "@prisma/client"
import {
  InfrastructureException
}                                      from "../../shared/domain/exceptions/infrastructure_exception"
import * as changeCase                 from "change-case"
import { User }                        from "../../user/domain/user"
import {
  Errors
}                                      from "../../shared/domain/exceptions/errors"
import { Sale }                        from "../../sales/domain/sale"
import { Product }                     from "../../product/domain/product"
import { OrderItem }                   from "../domain/order_item"

export class PrismaOrderData implements OrderDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( order: Order ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.order.create( {
          data: {
            id       : order.id.toString(),
            userId   : order.user.id.toString(),
            status   : order.status.value,
            total    : order.total.value,
            createdAt: order.createdAt.toString(),
            updatedAt: order.updatedAt?.toString()
          }
        } ),
        this.db.orderItem.createMany( {
          data: order.items.map( item => (
            {
              id             : item.id.toString(),
              orderId        : order.id.toString(),
              productId      : item.product.id.toString(),
              quantity       : item.quantity.value,
              priceAtPurchase: item.priceAtPurchase.value
            }
          ) )
        } )
      ] )
      return right( true )
    }
    catch ( error ) {
      return left( new InfrastructureException() )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.order.delete( {
          where: {
            id: id.toString()
          }
        } ),
        this.db.orderItem.deleteMany( {
          where: {
            orderId: id.toString()
          }
        } )
      ] )
      return right( true )
    }
    catch ( error ) {
      return left( new InfrastructureException() )
    }
  }

  parseItemsData( items: any[] ): Either<BaseException[], OrderItem[]> {
    let results: OrderItem[] = []
    for ( const item of items ) {
      const sellerDb       = item.seller
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
      if ( item.sale ) {
        const saleMapped = Sale.fromPrimitives(
          item.sale.id.toString(),
          item.sale.description,
          item.sale.percentage,
          item.sale.startDate.toString(),
          item.sale.endDate.toString(),
          item.sale.isActive,
          item.sale.createdAt.toString(),
          item.sale.productId.toString()
        )

        if ( saleMapped instanceof Errors ) {
          return left( saleMapped.values )
        }
        sale = saleMapped
      }
      const product = Product.fromPrimitives(
        item.product.id.toString(),
        item.product.name,
        item.product.description,
        item.product.price,
        item.product.stock,
        item.product.imageUrl,
        seller,
        item.product.createdAt.toString(),
        item.product.updatedAt?.toString()
      )

      if ( product instanceof Errors ) {
        return left( product.values )
      }
      const orderItem = OrderItem.fromPrimitives(
        item.id.toString(),
        item.priceAtPurchase,
        product,
        item.quantity,
      )

      if ( orderItem instanceof Errors ) {
        return left( orderItem.values )
      }

      results.push( orderItem )
    }

    return right( results )
  }


  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<Order>>> {
    try {
      const where = {}
      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals: query.id.toString()
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }
      const offset            = skip ? parseInt( skip.value ) : 0
      const results           = await this.db.$transaction( [
        this.db.order.findMany( {
          where  : where,
          orderBy: orderBy,
          skip   : offset,
          take   : limit?.value,
          include: {
            customer  : true,
            orderItems: {
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
        this.db.order.count( {
          where: where
        } )
      ] )
      const [response, total] = results

      const result: Order[] = []
      for ( const e of response ) {
        const customer = User.fromPrimitives(
          e.customer.id.toString(),
          e.customer.name,
          e.customer.email,
          JSON.parse( e.customer.metadata ),
          [],
          e.customer.createdAt.toString(),
          e.customer.updatedAt?.toString()
        )
        if ( customer instanceof Errors ) {
          return left( customer.values )
        }

        const data = this.parseItemsData( e.orderItems )
        if ( isLeft( data ) ) {
          return left( data.left )
        }
        const mapped = Order.fromPrimitives(
          e.id,
          customer,
          e.total,
          e.status,
          data.right,
          e.createdAt.toString(),
          e.updatedAt?.toString()
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

  async update( order: Order ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.order.update( {
          where: {
            id: order.id.toString()
          },
          data : {
            userId   : order.user.id.toString(),
            status   : order.status.value,
            total    : order.total.value,
            createdAt: order.createdAt.toString(),
            updatedAt: order.updatedAt?.toString()
          }
        } ),
        this.db.orderItem.deleteMany( {
          where: {
            orderId: order.id.toString()
          }
        } ),
        this.db.orderItem.createMany( {
          data: order.items.map( item => (
            {
              id             : item.id.toString(),
              orderId        : order.id.toString(),
              productId      : item.product.id.toString(),
              quantity       : item.quantity.value,
              priceAtPurchase: item.priceAtPurchase.value
            }
          ) )
        } )
      ] )
      return right( true )
    }
    catch ( error ) {
      return left( new InfrastructureException() )
    }
  }
}