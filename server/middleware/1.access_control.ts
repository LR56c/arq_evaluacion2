import { H3Event }             from "h3"
import { RoleLevel }           from "~~/modules/role/domain/role_level"
import { RoleDTO }             from "~~/modules/role/application/role_dto"
import {
  BaseException
}                              from "~~/modules/shared/domain/exceptions/base_exception"
import { getHighterRoleLevel } from "~~/shared/utils/get_highter_role_level"
import { appLogger }           from "~~/server/instrumentation/app_dependencies"
import { verifyJwt }           from "~~/server/utils/verify_jwt"

interface RouteControl {
  base: string,
  methods: {
    GET?: RoleLevel;
    POST?: RoleLevel;
    PUT?: RoleLevel;
    DELETE?: RoleLevel;
  };
}

const auth_control: RouteControl[] = [
  {
    base   : "/api/auth/login",
    methods: {
      "POST": RoleLevel.ADMIN
    }
  },
  {
    base   : "/api/auth/register",
    methods: {
      "POST": RoleLevel.ADMIN
    }
  },
  {
    base   : "/api/auth/oauth",
    methods: {
      "POST": RoleLevel.ADMIN
    }
  },
  {
    base   : "/api/auth/logout",
    methods: {
      "POST": RoleLevel.USER
    }
  },
  {
    base   : "/api/auth/confirm",
    methods: {
      "POST": RoleLevel.USER
    }
  },
  {
    base   : "/api/auth",
    methods: {
      "DELETE": RoleLevel.ADMIN
    }
  }
]

const factibility_control: RouteControl[] = [
  {
    base   : "/api/factibility",
    methods: {
      "GET"   : RoleLevel.MOD,
      "PUT"   : RoleLevel.MOD,
      "DELETE": RoleLevel.MOD
    }
  }
]

const notification_control: RouteControl[] = [
  {
    base   : "/api/notification",
    methods: {
      "POST": RoleLevel.MOD,
      "GET" : RoleLevel.USER,
      "PUT" : RoleLevel.USER
    }
  }
]

const notification_config_control: RouteControl[] = [
  {
    base   : "/api/notification_config",
    methods: {
      "POST"  : RoleLevel.USER,
      "GET"   : RoleLevel.USER,
      "DELETE": RoleLevel.ADMIN
    }
  }
]

const number_control: RouteControl[] = [
  {
    base   : "/api/number",
    methods: {
      "POST"  : RoleLevel.ADMIN,
      "DELETE": RoleLevel.ADMIN
    }
  }
]

const property_usage_control: RouteControl[] = [
  {
    base   : "/api/property_usage",
    methods: {
      "DELETE": RoleLevel.MOD,
      "POST"  : RoleLevel.MOD,
      "GET"   : RoleLevel.MOD,
      "PUT"   : RoleLevel.MOD
    }
  }
]

const reviewer_control: RouteControl[] = [
  {
    base   : "/api/reviewer",
    methods: {
      "DELETE": RoleLevel.MOD,
      "POST"  : RoleLevel.MOD,
      "GET"   : RoleLevel.MOD,
      "PUT"   : RoleLevel.MOD
    }
  }
]

const role_control: RouteControl[] = [
  {
    base   : "/api/role",
    methods: {
      "GET"   : RoleLevel.ADMIN,
      "POST"  : RoleLevel.ADMIN,
      "PUT"   : RoleLevel.ADMIN,
      "DELETE": RoleLevel.ADMIN
    }
  }
]

const user_control: RouteControl[] = [
  {
    base   : "/api/user",
    methods: {
      "DELETE": RoleLevel.ADMIN,
      "GET"   : RoleLevel.ADMIN,
      "POST"  : RoleLevel.ADMIN,
      "PUT"   : RoleLevel.ADMIN
    }
  }
]

const user_repository_control: RouteControl[] = [
  {
    base   : "/api/user_repository",
    methods: {
      "POST": RoleLevel.USER,
      "GET" : RoleLevel.USER,
      "PUT" : RoleLevel.MOD
    }
  }
]

const orquestator_control: RouteControl[] = [
  {
    base   : "/api/o/user",
    methods: {
      "DELETE": RoleLevel.ADMIN,
      "PUT"   : RoleLevel.ADMIN
    }
  },
  {
    base   : "/api/o/user/generate",
    methods: {
      "POST": RoleLevel.ADMIN
    }
  },
  {
    base   : "/api/o/approve",
    methods: {
      "PUT": RoleLevel.ADMIN
    }
  }
]

const access_control: RouteControl[] = [
  ...auth_control,
  ...factibility_control,
  ...notification_control,
  ...notification_config_control,
  ...number_control,
  ...property_usage_control,
  ...reviewer_control,
  ...user_control,
  ...role_control,
  ...user_repository_control,
  ...orquestator_control,
]

const requiredRouteLevel = ( path: string, method: string ): RoleLevel => {
  const route = access_control.find(
    ( entry ) => path.startsWith( entry.base ) )
  if ( !route ) {
    return RoleLevel.PUBLIC
  }
  const keyMethod     = method as keyof typeof route.methods
  const requiredLevel = route.methods[keyMethod]
  return requiredLevel ?? RoleLevel.PUBLIC
}

const getUserData = ( json: unknown ): {
                                         role: RoleLevel,
                                         user_id: string
                                       } | undefined => {
  const user     = (
    json as { roles: RoleDTO[], user_id: string }
  )
  const userRole = getHighterRoleLevel( user.roles.map( role => role.name ) )
  if ( userRole === undefined ) {
    return undefined
  }
  return {
    role   : userRole,
    user_id: user.user_id
  }
}

// const getUser = async ( event: H3Event ) => {
//   const session = await getUserSession( event )
//   return session.user?.ut ?? undefined
// }
export default defineEventHandler( async ( event ) => {
  return appLogger.trace( "middleware", "access control", async () => {
    // event.context.highterRole = "public"

    console.log( "event", event.path )
    const routeLevel = requiredRouteLevel( event.path, event.method )

    const token: string | undefined = getRequestHeader( event, "ut" ) ??
      await getUser( event ) ?? undefined

    const jwt = await verifyJwt( token ?? "" )
    if ( jwt instanceof BaseException ) {
      if ( routeLevel === RoleLevel.PUBLIC ) {
        return
      }
      console.log( "no jwt" )
      throw createError( {
        statusCode   : 401,
        statusMessage: "Bad Request"
      } )
    }
    const user    = getUserData( jwt.payload.user )
    const bAccess = user && user.role >= routeLevel
    if ( !bAccess ) {
      console.log( "no access", user, routeLevel )
      throw createError( {
        statusCode   : 401,
        statusMessage: "Bad Request"
      } )
    }
    // event.context.auth        = user.user_id ?? undefined
    // event.context.highterRole = user ? (
    //   RoleLevel[user.role]
    // ).toLowerCase() : "public"
  } )
} )
