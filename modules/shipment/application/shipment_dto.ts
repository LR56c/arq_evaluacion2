import { z } from "zod"
import {
  percetageSchema
}            from "../../shared/domain/value_objects/valid_percentage"

export const shipmentSchema = z.object( {
  id                : z.uuid(),
  order_id          : z.uuid(),
  address_id        : z.uuid(),
  tracking_number   : z.string(),
  pickup_date_time  : z.iso.datetime().optional(),
  shipping_date_time: z.iso.datetime().optional(),
  delivery_date_time: z.iso.datetime().optional()
} )

export type ShipmentDTO = z.infer<typeof shipmentSchema>
