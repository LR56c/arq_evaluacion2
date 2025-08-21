import { AddRole }             from "~~/modules/role/application/add_role"
import { RemoveRole }          from "~~/modules/role/application/remove_role"
import { SearchRole }          from "~~/modules/role/application/search_role"
import { UpdateRole }          from "~~/modules/role/application/update_role"
import type { RoleDTO }        from "~~/modules/role/application/role_dto"
import type { Either }         from "fp-ts/Either"
import { isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "~~/modules/shared/domain/exceptions/base_exception"
import { RoleMapper }          from "~~/modules/role/application/role_mapper"
import type {
  RoleInstrumentation
} from "~~/server/instrumentation/role_instrumentation"

export class RoleService {
  constructor(
    private readonly addRole: AddRole,
    private readonly removeRole: RemoveRole,
    private readonly searchRole: SearchRole,
    private readonly updateRole: UpdateRole,
    private readonly instrumentation: RoleInstrumentation
  )
  {
  }

  async add( dto: RoleDTO ): Promise<Either<BaseException[], boolean>> {
    const result = await this.addRole.execute( dto )
    if ( isLeft( result ) ) {
      await this.instrumentation.addRoleFailed( result.left )
    }
    return result
  }

  async remove( id: string ): Promise<Either<BaseException[], boolean>> {
    const result = await this.removeRole.execute( id )
    if ( isLeft( result ) ) {
      await this.instrumentation.removeRoleFailed( result.left )
    }
    return result
  }

  async search( query: Record<string, any>, limit ?: number, skip ?: string,
    sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], RoleDTO[]>> {
    const result = await this.searchRole.execute( query, limit, skip, sortBy,
      sortType )

    if ( isLeft( result ) ) {
      await this.instrumentation.searchRoleFailed( result.left )
      return left( result.left )
    }

    return right( result.right.map( rol => RoleMapper.toDTO( rol ) ) )
  }

  async update( prevName: string,
    newName: string ): Promise<Either<BaseException[], boolean>> {
    const result = await this.updateRole.execute( prevName, newName )
    if ( isLeft( result ) ) {
      await this.instrumentation.updateRoleFailed( result.left )
    }
    return result
  }
}
