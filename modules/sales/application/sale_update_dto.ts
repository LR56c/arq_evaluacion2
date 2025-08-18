import { z }             from "zod"
import { countrySchema } from "../../country/application/country_dto"
import {
  percetageSchema
}                        from "../../shared/domain/value_objects/valid_percentage"

export const saleUpdateSchema = z.object( {
  id         : z.uuid(),
  description: z.string().optional(),
  percentage : percetageSchema.optional(),
  start_date : z.iso.datetime().optional(),
  end_date   : z.iso.datetime().optional(),
  is_active  : z.boolean().optional(),
  product_id : z.uuid().optional()
} )

export type SaleUpdateDTO = z.infer<typeof saleUpdateSchema>
