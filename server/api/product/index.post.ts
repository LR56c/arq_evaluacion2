import { isLeft } from "fp-ts/Either"
import {
  parseData
}                 from "~~/modules/shared/application/parse_handlers"
import {
  productRequestSchema
}                 from "~~/modules/product/application/product_request"
import { productService } from "~~/server/dependencies/dependencies"

export default defineEventHandler( async ( event ) => {
  const body       = await readBody( event )
  const dataResult = await parseData( productRequestSchema, body )

  if ( isLeft( dataResult ) ) {
    throw createError( {
      statusCode   : 400,
      statusMessage: "Bad Request"
    } )
  }
  const result = await productService.add( dataResult.right )

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
