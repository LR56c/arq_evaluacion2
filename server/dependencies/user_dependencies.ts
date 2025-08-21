import prisma          from "~~/lib/prisma"
import { AddUser }     from "~~/modules/user/application/add_user"
import { SearchUser }  from "~~/modules/user/application/search_user"
import { RemoveUser }  from "~~/modules/user/application/remove_user"
import { UpdateUser }  from "~~/modules/user/application/update_user"
import { UserService } from "~~/server/services/user_service"
import { searchRole }  from "~~/server/dependencies/role_dependencies"
import {
  SentryInstrumentation
}                      from "~~/shared/infrastructure/sentry_instrumentation"
import {
  UserInstrumentation
}                      from "~~/server/instrumentation/user_instrumentation"
import { PrismaUserData } from "~~/modules/user/infrastructure/prisma_user_data"

const dao                 = new PrismaUserData( prisma )
const add                 = new AddUser( dao, searchRole )
export const searchUser              = new SearchUser( dao )
const remove              = new RemoveUser( dao )
const update              = new UpdateUser( dao, searchRole )
const userLogger          = new SentryInstrumentation( "user" )
const userInstrumentation = new UserInstrumentation( userLogger )
export const userService  = new UserService( add, searchUser, remove,
  update,
  userInstrumentation )
