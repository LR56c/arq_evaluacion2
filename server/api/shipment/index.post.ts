import { isLeft }          from "fp-ts/Either"
import { parseData }       from "~~/modules/shared/application/parse_handlers"
import { shipmentSchema }  from "~~/modules/shipment/application/shipment_dto"
import { shipmentService } from "~~/server/dependencies/dependencies"

export default defineEventHandler( async ( event ) => {
  const body       = await readBody( event )
  const dataResult = parseData( shipmentSchema, body )

  if ( isLeft( dataResult ) ) {
    throw createError( {
      statusCode   : 400,
      statusMessage: "Bad Request"
    } )
  }
  const result = await shipmentService.add( dataResult.right )

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
