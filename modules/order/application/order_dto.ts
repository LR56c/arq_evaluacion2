import { z }                  from "zod"
import { orderItemSchema }    from "./order_item_dto"
import {
  userResponseSchema
}                             from "~~/modules/user/application/models/user_response"

export const orderSchema = z.object( {
  id        : z.uuid(),
  user      : userResponseSchema,
  total     : z.number(),
  status    : z.string(),
  items     : z.array( orderItemSchema ),
  created_at: z.iso.datetime()
} )

export type OrderDTO = z.infer<typeof orderSchema>
