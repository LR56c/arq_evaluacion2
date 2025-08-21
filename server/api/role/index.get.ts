import { parseQuery }  from "~~/server/utils/parse_handlers"
import { querySchema } from "~~/modules/shared/application/query_dto"
import { isLeft }      from "fp-ts/Either"
import { roleService } from "~~/server/dependencies/role_dependencies"

export default defineEventHandler( async ( event ) => {

  const queryDTO = await parseQuery( event, querySchema )
  const result   = await roleService.search( queryDTO.query, queryDTO.limit,
    queryDTO.skip, queryDTO.sort_by, queryDTO.sort_type )
  if ( isLeft( result ) ) {
    throw createError( {
      statusCode   : 400,
      statusMessage: "Bad Request"
    } )
  }

  return {
    statusMessage: "OK",
    statusCode   : 200,
    data         : result.right
  }
} )
