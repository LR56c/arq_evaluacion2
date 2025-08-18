import { z } from "zod"
import {
  percetageSchema
}            from "../../shared/domain/value_objects/valid_percentage"

export const saleSchema = z.object( {
  id         : z.uuid(),
  description: z.string(),
  percentage : percetageSchema,
  start_date : z.iso.datetime(),
  end_date   : z.iso.datetime(),
  is_active  : z.boolean(),
  created_at : z.iso.datetime(),
  product_id : z.uuid(),
} )

export type SaleDTO = z.infer<typeof saleSchema>
