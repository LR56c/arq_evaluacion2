import { z }          from "zod"
import { jsonSchema } from "../../../shared/domain/json_schema"
import { roleSchema } from "../../../role/application/role_dto"

export const userAdminResponseSchema = z.object( {
  id        : z.uuid(),
  name      : z.string(),
  email     : z.email(),
  metadata  : jsonSchema,
  roles     : z.array( roleSchema ),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().optional()
} )

export type UserAdminResponse = z.infer<typeof userAdminResponseSchema>
