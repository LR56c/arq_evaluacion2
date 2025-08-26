import { isLeft }            from "fp-ts/Either"
import { parseData }         from "~~/modules/shared/application/parse_handlers"
import { userService }       from "~~/server/dependencies/dependencies"
import {
  userRequestSchema
}                            from "~~/modules/user/application/models/user_request"

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
