import { z } from "zod"
import { passwordSchema } from "../../shared/domain/value_objects/password"

export const userRequestSchema = z.object( {
  id      : z.uuid(),
  email   : z.email(),
  password: passwordSchema,
  name    : z.string().optional(),
  roles   : z.array( z.string() )
} )

export type UserRequest = z.infer<typeof userRequestSchema>
