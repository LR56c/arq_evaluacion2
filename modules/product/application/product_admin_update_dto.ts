import { z }                  from "zod"
import { userResponseSchema } from "../../user/application/user_response"
import { saleSchema }         from "../../sales/application/sale_dto"

export const productAdminUpdateSchema = z.object( {
  id         : z.uuid(),
  name       : z.string().optional(),
  description: z.string().optional(),
  price      : z.number().optional(),
  stock      : z.number().optional(),
  image_url  : z.string().optional(),
  seller_id  : z.uuid().optional(),
  sale_id    : z.uuid().optional()
} )

export type ProductAdminUpdateDTO = z.infer<typeof productAdminUpdateSchema>
