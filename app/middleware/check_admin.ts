export default defineNuxtRouteMiddleware( async ( to ) => {
 const user = useUser()
  if(!user.can('MOD')){
    throw createError( {
      statusCode: 404,
      message   : "Unauthorized"
    } )
  }
} )
