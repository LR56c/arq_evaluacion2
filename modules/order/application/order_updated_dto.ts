import { z }                  from "zod"
import {
  percetageSchema
}                             from "../../shared/domain/value_objects/valid_percentage"
import { userResponseSchema } from "../../user/application/user_response"
import { orderItemSchema }    from "./order_item_dto"

export const orderUpdatedSchema = z.object( {
  id    : z.uuid(),
  user  : userResponseSchema.optional(),
  total : z.number().optional(),
  status: z.string().optional(),
  items : z.array( orderItemSchema ).optional()
} )

export type OrderUpdatedDTO = z.infer<typeof orderUpdatedSchema>
