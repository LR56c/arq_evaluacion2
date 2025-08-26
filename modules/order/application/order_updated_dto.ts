import { z }                  from "zod"
import { orderItemSchema }    from "./order_item_dto"
import {
  userResponseSchema
}                             from "~~/modules/user/application/models/user_response"

export const orderUpdatedSchema = z.object( {
  id    : z.uuid(),
  user  : userResponseSchema.optional(),
  total : z.number().optional(),
  status: z.string().optional(),
  items : z.array( orderItemSchema ).optional()
} )

export type OrderUpdatedDTO = z.infer<typeof orderUpdatedSchema>
