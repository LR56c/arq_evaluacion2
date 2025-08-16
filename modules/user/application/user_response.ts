import { z }          from "zod"
import { roleSchema } from "../../role/application/role_dto"
import { jsonSchema } from "../../shared/domain/json_schema"

export const userResponseSchema = z.object( {
  id        : z.uuid(),
  name      : z.string(),
  email     : z.email(),
  metadata  : jsonSchema,
  roles     : z.array( roleSchema ),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().optional()
} )

export type UserResponse = z.infer<typeof userResponseSchema>
