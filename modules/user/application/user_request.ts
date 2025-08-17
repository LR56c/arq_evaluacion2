import { z } from "zod"
import { passwordSchema } from "../../shared/domain/value_objects/password"
import { jsonSchema } from "../../shared/domain/json_schema"

export const userRequestSchema = z.object( {
  id      : z.uuid(),
  email   : z.email(),
  name    : z.string().optional(),
  metadata  : jsonSchema,
  password: passwordSchema,
  roles   : z.array( z.string() )
} )

export type UserRequest = z.infer<typeof userRequestSchema>
