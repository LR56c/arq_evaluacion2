import { isLeft }       from "fp-ts/Either"
import { parseData }    from "~~/modules/shared/application/parse_handlers"
import { orderSchema }  from "~~/modules/order/application/order_dto"
import { orderService } from "~~/server/dependencies/dependencies"

export default defineEventHandler( async ( event ) => {
  const body       = await readBody( event )
  const dataResult = await parseData( orderSchema, body )

  if ( isLeft( dataResult ) ) {
    throw createError( {
      statusCode   : 400,
      statusMessage: "Bad Request"
    } )
  }
  const result = await orderService.add( dataResult.right )

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
