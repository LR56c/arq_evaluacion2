import { isLeft }      from "fp-ts/Either"
import { roleService } from "~~/server/dependencies/role_dependencies"
import { roleSchema }  from "~~/modules/role/application/role_dto"

export default defineEventHandler( async ( event ) => {
  const dto    = await parseBody( event, roleSchema )
  const result = await roleService.add( dto )
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
