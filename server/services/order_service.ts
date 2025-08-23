import type { Either }          from "fp-ts/Either"
import { isLeft, left, right }  from "fp-ts/Either"
import {
  BaseException
}                               from "~~/modules/shared/domain/exceptions/base_exception"
import type { PaginatedResult } from "~~/modules/shared/domain/paginated_result"
import { AddOrder }             from "~~/modules/order/application/add_order"
import { RemoveOrder }          from "~~/modules/order/application/remove_order"
import { SearchOrder }          from "~~/modules/order/application/search_order"
import { UpdateOrder }          from "~~/modules/order/application/update_order"
import {
  OrderInstrumentation
}                               from "~~/server/instrumentation/order_instrumentation"
import { OrderDTO }             from "~~/modules/order/application/order_dto"
import { OrderMapper }          from "~~/modules/order/application/order_mapper"
import {
  OrderUpdatedDTO
}                               from "~~/modules/order/application/order_updated_dto"

export class OrderService {
  constructor(
    private readonly addOrder: AddOrder,
    private readonly removeOrder: RemoveOrder,
    private readonly searchOrder: SearchOrder,
    private readonly updateOrder: UpdateOrder,
    private readonly instrumentation: OrderInstrumentation
  )
  {
  }

  async add( dto: OrderDTO ): Promise<Either<BaseException[], boolean>> {
    const result = await this.addOrder.execute( dto )
    if ( isLeft( result ) ) {
      await this.instrumentation.addOrderFailed( result.left )
    }
    return right( true )
  }

  async remove( id: string ): Promise<Either<BaseException[], boolean>> {
    const result = await this.removeOrder.execute( id )
    if ( isLeft( result ) ) {
      await this.instrumentation.removeOrderFailed( result.left )
    }
    return right( true )
  }

  async search( query: Record<string, any>, limit ?: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<OrderDTO>>> {
    const result = await this.searchOrder.execute( query, limit, skip, sortBy,
      sortType )

    if ( isLeft( result ) ) {
      await this.instrumentation.searchOrderFailed( result.left )
      return left( result.left )
    }

    return right( {
      total: result.right.total,
      items: result.right.items.map( OrderMapper.toDTO )
    } )
  }

  async update( dto: OrderUpdatedDTO ): Promise<Either<BaseException[], boolean>> {
    const result = await this.updateOrder.execute( dto )
    if ( isLeft( result ) ) {
      await this.instrumentation.updateOrderFailed( result.left )
    }
    return right( true )
  }
}
