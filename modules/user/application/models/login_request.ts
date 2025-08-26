import { z }              from "zod"
import { passwordSchema } from "../../../shared/domain/value_objects/password"

export const loginRequestSchema = z.object( {
  email   : z.email(),
  password: passwordSchema
} )

export type LoginRequest = z.infer<typeof loginRequestSchema>
