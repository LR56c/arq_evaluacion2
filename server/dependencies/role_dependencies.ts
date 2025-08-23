import prisma          from "~~/lib/prisma"
import { AddRole }     from "~~/modules/role/application/add_role"
import { RemoveRole }  from "~~/modules/role/application/remove_role"
import { SearchRole }  from "~~/modules/role/application/search_role"
import { UpdateRole }  from "~~/modules/role/application/update_role"
import { RoleService } from "~~/server/services/role_service"
import {
  RoleInstrumentation
}                      from "~~/server/instrumentation/role_instrumentation"
import {
  SentryInstrumentation
}                      from "~~/shared/infrastructure/sentry_instrumentation"
import {
  PrismaRoleData
}                      from "~~/modules/role/infrastructure/prisma_role_data"

const dao                 = new PrismaRoleData( prisma )
const add                 = new AddRole( dao )
const remove              = new RemoveRole( dao )
export const searchRole   = new SearchRole( dao )
const update              = new UpdateRole( dao )
const roleLogger          = new SentryInstrumentation( "role" )
const roleInstrumentation = new RoleInstrumentation( roleLogger )
export const roleService  = new RoleService( add, remove, searchRole, update,
  roleInstrumentation )
