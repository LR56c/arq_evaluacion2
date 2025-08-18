import { z }             from "zod"
import { countrySchema } from "../../country/application/country_dto"

export const addressUpdateSchema = z.object( {
  id         : z.string(),
  street     : z.string().optional(),
  city       : z.string().optional(),
  state      : z.string().optional(),
  postal_code: z.string().optional(),
  country    : countrySchema.optional(),
  is_default : z.boolean().optional()
} )

export type AddressUpdateDTO = z.infer<typeof addressUpdateSchema>
