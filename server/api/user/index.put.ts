import { isLeft }           from "fp-ts/Either"
import { userService }      from "~~/server/dependencies/user_dependencies"
import { userUpdateSchema } from "~~/modules/user/application/user_update_dto"
import { parseData }        from "~~/modules/shared/application/parse_handlers"

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
