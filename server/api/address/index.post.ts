import { isLeft }         from "fp-ts/Either"
import { addressService } from "~~/server/dependencies/address_dependencies"
import { parseData }      from "~~/modules/shared/application/parse_handlers"
import { addressSchema }  from "~~/modules/address/application/address_dto"
import { z }              from "zod"

export default defineEventHandler( async ( event ) => {
  const body       = await readBody( event )
  const dataResult = await parseData( z.object( {
    address: addressSchema,
    user_id: z.string()
  } ), body )

  if ( isLeft( dataResult ) ) {
    throw createError( {
      statusCode   : 400,
      statusMessage: "Bad Request"
    } )
  }
  const result = await addressService.add(
    dataResult.right.user_id,
    dataResult.right.address
  )
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
