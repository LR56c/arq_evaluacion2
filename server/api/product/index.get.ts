import { querySchema }    from "~~/modules/shared/application/query_dto"
import { isLeft }         from "fp-ts/Either"
import { parseData }      from "~~/modules/shared/application/parse_handlers"
import { productService } from "~~/server/dependencies/product_dependencies"

export default defineEventHandler( async ( event ) => {
  const query = getQuery( event )
  const dataResult  = parseData(querySchema, query)

  if( isLeft(dataResult) ) {
    throw createError( {
      statusCode   : 400,
      statusMessage: "Bad Request"
    } )
  }
  const data = dataResult.right

  const result   = await productService.search(
    data.query,
    data.limit,
    data.skip,
    data.sort_by,
    data.sort_type
  )

  if ( isLeft( result ) ) {
    throw createError( {
      statusCode   : 400,
      statusMessage: "Bad Request"
    } )
  }

  return {
    statusMessage: "OK",
    statusCode   : 200,
    data         : result.right
  }
} )
