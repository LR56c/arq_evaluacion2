import { z }                  from "zod"

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
