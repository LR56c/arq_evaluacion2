import { isLeft }      from "fp-ts/Either"
import { roleService } from "~~/server/dependencies/role_dependencies"
import { parseData }   from "~~/modules/shared/application/parse_handlers"
import { z }           from "zod"

export default defineEventHandler( async ( event ) => {
  const body       = await readBody( event )
  const dataResult = await parseData( z.object({
    prev_name  : z.string(),
    new_name  : z.string(),
  }), body )
  if ( isLeft( dataResult ) ) {
    throw createError( {
      statusCode   : 400,
      statusMessage: "Bad Request"
    } )
  }
  const result = await roleService.update(
    dataResult.right.prev_name,
    dataResult.right.new_name
  )

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
