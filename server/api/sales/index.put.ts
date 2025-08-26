import { isLeft }           from "fp-ts/Either"
import { parseData }        from "~~/modules/shared/application/parse_handlers"
import { saleUpdateSchema } from "~~/modules/sales/application/sale_update_dto"
import { saleService }      from "~~/server/dependencies/dependencies"

export default defineEventHandler( async ( event ) => {
  const body       = await readBody( event )
  const dataResult = await parseData( saleUpdateSchema, body )
  if ( isLeft( dataResult ) ) {
    throw createError( {
      statusCode   : 400,
      statusMessage: "Bad Request"
    } )
  }
  const result = await saleService.update( dataResult.right )

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
