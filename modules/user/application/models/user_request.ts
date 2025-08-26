import { z } from "zod"
import { jsonSchema } from "../../../shared/domain/json_schema"

export const userRequestSchema = z.object( {
  id      : z.uuid(),
  email   : z.email(),
  name    : z.string(),
  metadata  : jsonSchema,
} )

export type UserRequest = z.infer<typeof userRequestSchema>
