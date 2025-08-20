import { z }                  from "zod"
import {
  percetageSchema
}                             from "../../shared/domain/value_objects/valid_percentage"
import { userResponseSchema } from "../../user/application/user_response"
import { orderItemSchema }    from "./order_item_dto"

export const orderSchema = z.object( {
  id        : z.uuid(),
  user      : userResponseSchema,
  total     : z.number(),
  status    : z.string(),
  items     : z.array( orderItemSchema ),
  created_at: z.iso.datetime()
} )

export type OrderDTO = z.infer<typeof orderSchema>
