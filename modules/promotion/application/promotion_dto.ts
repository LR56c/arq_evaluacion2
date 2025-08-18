import { z }                      from "zod"
import {
  percetageSchema
}                                 from "../../shared/domain/value_objects/valid_percentage"
import { promotionProductSchema } from "./promotion_product_dto"

export const promotionSchema = z.object( {
  id         : z.uuid(),
  name       : z.string(),
  percentage : percetageSchema,
  start_date : z.iso.datetime(),
  end_date   : z.iso.datetime(),
  is_active  : z.boolean(),
  products   : z.array(promotionProductSchema),
  created_at : z.iso.datetime(),
  description: z.string().optional()
} )

export type PromotionDTO = z.infer<typeof promotionSchema>
