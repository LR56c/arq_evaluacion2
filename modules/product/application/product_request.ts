import { z } from "zod"

export const productRequestSchema = z.object( {
  id         : z.uuid(),
  name       : z.string(),
  description: z.string(),
  price      : z.number(),
  stock      : z.number(),
  image_url  : z.string(),
  seller_id  : z.uuid(),
  sale_id    : z.uuid().optional()
} )

export type ProductRequest = z.infer<typeof productRequestSchema>
