import { z } from "zod"

export const sellerSchema = z.object( {
  company_name : z.string().optional(),
} )

export type SellerDTO = z.infer<typeof sellerSchema>
