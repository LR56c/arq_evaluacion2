import { isLeft }       from "fp-ts/Either"
import {
  parseData
}                       from "~~/modules/shared/application/parse_handlers"
import { orderService } from "~~/server/dependencies/order_dependencies"
import {
  orderUpdatedSchema
}                       from "~~/modules/order/application/order_updated_dto"

export default defineEventHandler( async ( event ) => {
  const body       = await readBody( event )
  const dataResult = await parseData( orderUpdatedSchema, body )
  if ( isLeft( dataResult ) ) {
    throw createError( {
      statusCode   : 400,
      statusMessage: "Bad Request"
    } )
  }
  const result = await orderService.update( dataResult.right )

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
