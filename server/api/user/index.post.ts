import { isLeft }            from "fp-ts/Either"
import { userService }       from "~~/server/dependencies/user_dependencies"
import { userRequestSchema } from "~~/modules/user/application/user_request"
import { parseData }         from "~~/modules/shared/application/parse_handlers"

export default defineEventHandler( async ( event ) => {
  const body       = await readBody( event )
  const dataResult = await parseData( userRequestSchema, body )

  if ( isLeft( dataResult ) ) {
    throw createError( {
      statusCode   : 400,
      statusMessage: "Bad Request"
    } )
  }
  const result = await userService.add( dataResult.right )
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
