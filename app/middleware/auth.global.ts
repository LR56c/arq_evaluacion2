import { navigateTo, useFetch } from "nuxt/app"
import { authClient }           from "~~/lib/auth_client"

const publicRoutes = ["/", "/login", "/register"]
export default defineNuxtRouteMiddleware( async ( to, from ) => {
  const { data: session } = await authClient.useSession( useFetch )
  if ( !session.value && !publicRoutes.includes( to.path ) ) {
    return navigateTo( "/login" )
  }
} )