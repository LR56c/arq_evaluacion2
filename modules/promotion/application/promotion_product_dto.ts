import { z } from "zod"
import {
  percetageSchema
}            from "../../shared/domain/value_objects/valid_percentage"
import {
  productResponseSchema
}            from "../../product/application/product_response"

export const promotionProductSchema = z.object( {
  quantity: z.number(),
  product : productResponseSchema
} )

export type PromotionProductDTO = z.infer<typeof promotionProductSchema>
