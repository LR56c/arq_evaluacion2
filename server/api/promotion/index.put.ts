import { isLeft } from "fp-ts/Either"
import {
  parseData
}                 from "~~/modules/shared/application/parse_handlers"
import {
  promotionUpdateSchema
}                 from "~~/modules/promotion/application/promotion_update_dto"
import { promotionService } from "~~/server/dependencies/dependencies"

export default defineEventHandler( async ( event ) => {
  const body       = await readBody( event )
  const dataResult = await parseData( promotionUpdateSchema, body )
  if ( isLeft( dataResult ) ) {
    throw createError( {
      statusCode   : 400,
      statusMessage: "Bad Request"
    } )
  }
  const result = await promotionService.update( dataResult.right )

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
