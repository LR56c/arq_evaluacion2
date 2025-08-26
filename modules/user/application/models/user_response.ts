import { z }          from "zod"
import { jsonSchema } from "~~/modules/shared/domain/json_schema"

export const userResponseSchema = z.object( {
  // id        : z.uuid(),
  // name      : z.string(),
  // email     : z.email(),
  // metadata  : jsonSchema,
} )

export type UserResponse = z.infer<typeof userResponseSchema>
