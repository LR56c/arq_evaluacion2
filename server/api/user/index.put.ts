import { isLeft }           from "fp-ts/Either"
import { parseData }        from "~~/modules/shared/application/parse_handlers"
import { userService }      from "~~/server/dependencies/dependencies"
import {
  userUpdateSchema
}                           from "~~/modules/user/application/models/user_update_dto"

export default defineEventHandler( async ( event ) => {
  const body       = await readBody( event )
  const dataResult = await parseData( userUpdateSchema, body )
  if ( isLeft( dataResult ) ) {
    throw createError( {
      statusCode   : 400,
      statusMessage: "Bad Request"
    } )
  }
  const result = await userService.update( dataResult.right )
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
