import { z }           from "zod"
import { isLeft }      from "fp-ts/Either"
import { parseData }   from "~~/modules/shared/application/parse_handlers"
import { saleService } from "~~/server/dependencies/dependencies"

export default defineEventHandler( async ( event ) => {

  const id = getRouterParam( event, "id" )

  const dataResult  = await parseData( z.object( {
    id: z.string()
  } ), {
    id
  } )

  if( isLeft(dataResult) ) {
    throw createError( {
      statusCode   : 400,
      statusMessage: "Bad Request"
    } )
  }

  const result = await saleService.remove( dataResult.right.id )
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
