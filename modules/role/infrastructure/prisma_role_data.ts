import { PrismaClient }             from "@prisma/client"
import { type Either, left, right } from "fp-ts/Either"
import * as changeCase              from "change-case"
import {
  ValidInteger
}                                   from "../../shared/domain/value_objects/valid_integer"
import {
  ValidString
}                                   from "../../shared/domain/value_objects/valid_string"
import { RoleDAO }                  from "../domain/role_dao"
import {
  BaseException
}                                   from "../../shared/domain/exceptions/base_exception"
import { Role }                     from "../domain/role"
import {
  UUID
}                                   from "../../shared/domain/value_objects/uuid"
import { Errors }                   from "../../shared/domain/exceptions/errors"
import {
  InfrastructureException
}                                   from "../../shared/domain/exceptions/infrastructure_exception"

export class PrismaRoleData implements RoleDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], Role[]>> {
    try {
      const where = {}
      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals: query.id.toString()
        }
      }
      if ( query.ids ) {
        const arr: string[] = query.ids.split( "," )
        const ids           = arr.map(
          i => UUID.from( i ).toString() )
        // @ts-ignore
        where["id"]         = {
          in: ids
        }
      }
      if ( query.name ) {
        // @ts-ignore
        where["name"] = {
          contains: query.name
        }
      }
      if ( query.names ) {
        const arr: string[] = query.names.split( "," )
        const names         = arr.map( i => ValidString.from( i ).value )
        // @ts-ignore
        where["name"]       = {
          in: names
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }
      const offset   = skip ? parseInt( skip.value ) : 0
      const response = await this.db.role.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value
      } )

      const result: Role[] = []
      for ( const e of response ) {
        const mapped = Role.fromPrimitives( e.id.toString(), e.name,
          e.createdAt,
          e.updatedAt )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        result.push( mapped )
      }
      return right( result )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async add( role: Role ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.role.create( {
        data: {
          id       : role.id.toString(),
          name     : role.name.value,
          createdAt: role.createdAt.toString(),
          updatedAt: role.updatedAt?.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.role.delete( {
        where: {
          id: id.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async update( role: Role ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.role.update( {
        where: {
          id: role.id.toString()
        },
        data : {
          name     : role.name.value,
          updatedAt: role.updatedAt?.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }

  }
}
