import { z }                  from "zod"
import { userResponseSchema } from "../../user/application/user_response"
import { saleSchema }         from "../../sales/application/sale_dto"

export const productAdminResponseSchema = z.object( {
  id         : z.uuid(),
  name       : z.string(),
  description: z.string(),
  price      : z.number(),
  stock      : z.number(),
  image_url  : z.string (),
  seller     : userResponseSchema,
  sale       : saleSchema,
  created_at : z.iso.datetime(),
  updated_at : z.iso.datetime().optional()
} )

export type ProductAdminResponse = z.infer<typeof productAdminResponseSchema>
