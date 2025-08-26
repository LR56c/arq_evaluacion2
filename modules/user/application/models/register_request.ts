import { z }              from "zod"
import { jsonSchema }     from "../../../shared/domain/json_schema"
import { passwordSchema } from "../../../shared/domain/value_objects/password"

export const registerRequestSchema = z.object( {
  email   : z.email(),
  name    : z.string(),
  password: passwordSchema,
  metadata  : jsonSchema,
} )

export type RegisterRequest = z.infer<typeof registerRequestSchema>
