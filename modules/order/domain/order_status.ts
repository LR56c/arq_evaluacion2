import { z } from "zod"
import {
  InvalidOrderStatusException
} from "./exception/invalid_order_status_exception"

export enum OrderStatusEnum {
  PENDING   = "PENDING",
  SHIPPED   = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export class OrderStatus {

  readonly value: OrderStatusEnum

  private constructor( value: OrderStatusEnum ) {
    this.value = value
  }

  static create( value: OrderStatusEnum ): OrderStatus {
    return new OrderStatus( value )
  }

  static from( value: string ): OrderStatus {
    const result = z.enum( OrderStatusEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidOrderStatusException()
    }
    return new OrderStatus( result.data )
  }

  static fromOrNull( value: string ): OrderStatus | undefined {
    try {
      return OrderStatus.from( value )
    }
    catch {
      return undefined
    }
  }
}
