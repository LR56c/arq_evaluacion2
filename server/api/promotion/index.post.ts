import { isLeft }           from "fp-ts/Either"
import { parseData }        from "~~/modules/shared/application/parse_handlers"
import {
  promotionSchema
}                           from "~~/modules/promotion/application/promotion_dto"
import { promotionService } from "~~/server/dependencies/dependencies"

export default defineEventHandler( async ( event ) => {
  const body       = await readBody( event )
  const dataResult = await parseData( promotionSchema, body )

  if ( isLeft( dataResult ) ) {
    throw createError( {
      statusCode   : 400,
      statusMessage: "Bad Request"
    } )
  }
  const result = await promotionService.add( dataResult.right )

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
