import { z } from "zod"
import {
  percetageSchema
}            from "../../shared/domain/value_objects/valid_percentage"
import {
  productResponseSchema
}            from "../../product/application/product_response"

export const orderItemSchema = z.object( {
  id: z.uuid(),
  quantity: z.number(),
  price_at_purchase: z.number(),
  product : productResponseSchema
} )

export type OrderItemDTO = z.infer<typeof orderItemSchema>
