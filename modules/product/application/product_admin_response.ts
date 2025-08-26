import { z }                  from "zod"
import { saleSchema }         from "../../sales/application/sale_dto"
import {
  userAdminResponseSchema
} from "~~/modules/user/application/models/user_admin_response"

export const productAdminResponseSchema = z.object( {
  id         : z.uuid(),
  name       : z.string(),
  description: z.string(),
  price      : z.number(),
  stock      : z.number(),
  image_url  : z.string (),
  seller     : userAdminResponseSchema,
  sale       : saleSchema,
  created_at : z.iso.datetime(),
  updated_at : z.iso.datetime().optional()
} )

export type ProductAdminResponse = z.infer<typeof productAdminResponseSchema>
