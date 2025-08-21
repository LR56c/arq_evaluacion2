import { parseParams } from "~~/server/utils/parse_handlers"
import { z }           from "h3-zod"
import { isLeft }      from "fp-ts/Either"
import { roleService } from "~~/server/dependencies/role_dependencies"

export default defineEventHandler( async ( event ) => {
  const param  = await parseParams( event, z.object( {
    id: z.string()
  } ) )
  const body   = await parseBody( event, z.object( {
    name: z.string()
  } ) )
  const result = await roleService.update( param.id, body.name )

  if ( isLeft( result ) ) {
    throw createError( {
      statusCode   : 400,
      statusMessage: "Bad Request"
    } )
  }
  return {
    statusMessage: "OK",
    statusCode   : 200
  }
} )
