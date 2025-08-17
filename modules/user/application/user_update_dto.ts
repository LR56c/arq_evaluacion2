import { z }          from "zod"
import { jsonSchema } from "../../shared/domain/json_schema"

export const userUpdateSchema = z.object( {
  id        : z.uuid(),
  metadata  : jsonSchema.optional(),
  roles: z.union( [z.array( z.string() ).optional(), z.null()] )
} )

export type UserUpdateDTO = z.infer<typeof userUpdateSchema>
