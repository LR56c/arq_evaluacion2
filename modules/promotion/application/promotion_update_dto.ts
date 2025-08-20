import { z }                      from "zod"
import {
  percetageSchema
}                                 from "../../shared/domain/value_objects/valid_percentage"
import { promotionProductSchema } from "./promotion_product_dto"

export const promotionUpdateSchema = z.object( {
  id         : z.uuid(),
  name       : z.string().optional(),
  percentage : percetageSchema.optional(),
  start_date : z.iso.datetime().optional(),
  end_date   : z.iso.datetime().optional(),
  is_active  : z.boolean().optional(),
  products   : z.array( promotionProductSchema ).optional(),
  description: z.string().optional()
} )

export type PromotionUpdateDTO = z.infer<typeof promotionUpdateSchema>
