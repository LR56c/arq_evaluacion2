import { parseParams } from "~~/server/utils/parse_handlers"
import { z }           from "h3-zod"
import { isLeft }      from "fp-ts/Either"
import { roleService } from "~~/server/dependencies/role_dependencies"

export default defineEventHandler( async ( event ) => {
  const param  = await parseParams( event, z.object( {
    id: z.string()
  } ) )
  const result = await roleService.remove( param.id )
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
