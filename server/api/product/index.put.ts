import { isLeft } from "fp-ts/Either"
import {
  parseData
}                 from "~~/modules/shared/application/parse_handlers"
import {
  productAdminUpdateSchema
}                 from "~~/modules/product/application/product_admin_update_dto"
import { productService } from "~~/server/dependencies/dependencies"

export default defineEventHandler( async ( event ) => {
  const body       = await readBody( event )
  const dataResult = await parseData( productAdminUpdateSchema, body )
  if ( isLeft( dataResult ) ) {
    throw createError( {
      statusCode   : 400,
      statusMessage: "Bad Request"
    } )
  }
  const result = await productService.update( dataResult.right )

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
