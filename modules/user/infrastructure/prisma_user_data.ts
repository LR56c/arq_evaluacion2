import { PrismaClient }             from "@prisma/client"
import * as changeCase              from "change-case"
import { type Either, left, right } from "fp-ts/Either"
import { UserDAO }                  from "../domain/user_dao"
import {
  BaseException
}                                   from "../../shared/domain/exceptions/base_exception"
import {
  InfrastructureException
}                                   from "../../shared/domain/exceptions/infrastructure_exception"
import {
  UUID
}                                   from "../../shared/domain/value_objects/uuid"
import { User }                     from "../domain/user"
import {
  ValidInteger
}                                   from "../../shared/domain/value_objects/valid_integer"
import {
  ValidString
}                                   from "../../shared/domain/value_objects/valid_string"
import { PaginatedResult }          from "../../shared/domain/paginated_result"
import { Role }                     from "../../role/domain/role"
import { Errors }                   from "../../shared/domain/exceptions/errors"

export class PrismaUserData implements UserDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.user.delete( {
        where: {
          id: id.value
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async update( user: User ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.user.update( {
          where: {
            id: user.id.toString()
          },
          data : {
            name     : user.name.value,
            email    : user.email.value,
            updatedAt: user.updatedAt.toString(),
            metadata : user.metadata.toString()
          }
        } ),
        this.db.userRole.deleteMany( {
          where: {
            userId: user.id.toString()
          }
        } ),
        this.db.userRole.createMany( {
          data: user.roles.map( e => {
            return {
              userId    : user.id.toString(),
              roleId: e.id.toString()
            }
          } )
        } )
      ] )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async add( user: User ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.user.create( {
          data: {
            id           : user.id.toString(),
            name         : user.name.value,
            email        : user.email.value,
            emailVerified: true,
            createdAt    : user.createdAt.toString(),
            updatedAt    : user.updatedAt.toString(),
            metadata     : user.metadata.toString()
          }
        } ),
        this.db.userRole.createMany( {
          data: user.roles.map( e => {
            return {
              userId: user.id.toString(),
              roleId: e.id.toString()
            }
          } )
        } )
      ] )
      return right( true )
    }
    catch ( e )
    {
      return left( new InfrastructureException() )
    }
  }

  private queryWhere( query: Record<string, any> ): Record<string, any> {
    let where = {}
    if ( query.id ) {
      // @ts-ignore
      where["id"] = {
        equals: query.id
      }
    }
    if ( query.name ) {
      // @ts-ignore
      where["name"] = {
        contains: query.name,
        mode    : "insensitive"
      }
    }
    if ( query.email ) {
      // @ts-ignore
      where["email"] = {
        contains: query.email,
        mode    : "insensitive"
      }
    }
    if ( query.role_id ) {
      // @ts-ignore
      where["usersRoles"] = {
        some: {
          roleId: query.role_id
        }
      }
    }
    if ( query.dates ) {
      const [start, end] = query.dates.split( ";" )
      // @ts-ignore
      where["createdAt"] = {
        gte: new Date( start ),
        lte: new Date( end )
      }
    }
    if ( query.roles_names ) {
      const arr: string[] = query.roles_names.split( "," )
      const names         = arr.map( i => ValidString.from( i ).value )
      // @ts-ignore
      where["usersRoles"] = {
        some: {
          role: {
            name: {
              in: names
            }
          }
        }
      }
    }
    return where
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<User>>> {
    try {
      let where     = this.queryWhere( query )
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }

      const offset            = skip ? parseInt( skip.value ) : 0
      const results           = await this.db.$transaction( [
        this.db.user.findMany( {
          where  : where,
          orderBy: orderBy,
          skip   : offset,
          take   : limit?.value,
          include: {
            roles: {
              include: {
                role: true
              }
            }
          }
        } ),
        this.db.user.count( {
          where: where
        } )
      ] )
      const [response, total] = results
      const users: User[]     = []
      for ( const e of response ) {
        const roles: Role[] = []
        e.roles.forEach( ur => {
          const r = Role.fromPrimitivesThrow(
            ur.role.id.toString(),
            ur.role.name,
            ur.role.createdAt,
            ur.role.updatedAt
          )
          roles.push( r )
        } )
        const metadata = JSON.parse( e.metadata || "{}" )
        const result   = User.fromPrimitives(
          e.id.toString(),
          e.name,
          e.email,
          metadata,
          roles,
          e.createdAt,
          e.updatedAt
        )

        if ( result instanceof Errors ) {
          return left( result.values )
        }
        users.push( result )
      }
      return right( {
        items: users,
        total: total
      } )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }
}
