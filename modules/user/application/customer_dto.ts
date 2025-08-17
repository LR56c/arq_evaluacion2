import { z } from "zod"

export const customerSchema = z.object( {
  is_subscribed: z.boolean(),
  phone_number : z.string().optional()
} )

export type CustomerDTO = z.infer<typeof customerSchema>
