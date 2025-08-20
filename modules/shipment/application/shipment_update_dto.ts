import { z } from "zod"
import {
  percetageSchema
}            from "../../shared/domain/value_objects/valid_percentage"

export const shipmentUpdateSchema = z.object( {
  id                : z.uuid(),
  order_id          : z.uuid().optional(),
  address_id        : z.uuid().optional(),
  tracking_number   : z.string().optional(),
  pickup_date_time  : z.iso.datetime().optional(),
  shipping_date_time: z.iso.datetime().optional(),
  delivery_date_time: z.iso.datetime().optional()
} )

export type ShipmentUpdateDTO = z.infer<typeof shipmentUpdateSchema>
