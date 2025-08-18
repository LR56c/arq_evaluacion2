import { z }          from "zod"
import { saleSchema } from "../../sales/application/sale_dto"

export const productResponseSchema = z.object( {
  id         : z.uuid(),
  name       : z.string(),
  description: z.string(),
  price      : z.number(),
  stock      : z.number(),
  image_url  : z.string(),
  sale       : saleSchema,
} )

export type ProductResponse = z.infer<typeof productResponseSchema>
