import { z } from "zod"
import { countrySchema } from "../../country/application/country_dto"

export const addressSchema = z.object( {
  id: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postal_code: z.string(),
  country: countrySchema,
  is_default: z.boolean(),
  created_at: z.iso.datetime()
} )

export type AddressDTO = z.infer<typeof addressSchema>
