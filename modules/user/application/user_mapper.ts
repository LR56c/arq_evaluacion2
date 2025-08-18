import { User }                      from "../domain/user"
import { UserResponse }              from "./user_response"
import {
  Email
}                                    from "../../shared/domain/value_objects/email"
import {
  ValidString
}                                    from "../../shared/domain/value_objects/valid_string"
import {
  UUID
}                                    from "../../shared/domain/value_objects/uuid"
import {
  Errors
}                                    from "../../shared/domain/exceptions/errors"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"
import { RoleDTO }                   from "../../role/application/role_dto"
import { RoleMapper }                from "../../role/application/role_mapper"
import { Role }                      from "../../role/domain/role"
import { ValidJSON }                 from "../../shared/domain/json_schema"
import {
  ValidDate
}                                    from "../../shared/domain/value_objects/valid_date"

export class UserMapper {
  static toResponse( user: User ): UserResponse {
    return {
      id        : user.id.toString(),
      email     : user.email.value,
      name      : user.name.value,
      metadata  : user.metadata.value,
      roles     : user.roles.map( ( role ) => RoleMapper.toDTO( role ) ),
      created_at: user.createdAt.toString(),
      updated_at: user.updatedAt?.toString()
    }
  }

  static toJSON( user: UserResponse ): Record<string, any> {
    return {
      id        : user.id,
      email     : user.email,
      name      : user.name,
      metadata  : user.metadata,
      roles     : user.roles.map( ( role ) => role.name ),
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  }

  static toDomain( json: Record<string, any> ): User | Errors {
    const roles: Role[] = []

    if ( json.roles && Array.isArray( json.roles ) ) {
      for ( const role of json.roles ) {
        const r = RoleMapper.toDomain( role )
        if ( r instanceof Errors ) {
          return r
        }
        roles.push( r )
      }
    }

    return User.fromPrimitives(
      json.id,
      json.name,
      json.email,
      json.metadata,
      roles,
      json.created_at,
      json.updated_at
    )
  }

  static fromJSON( user: Record<string, any> ): UserResponse | Errors {
    const errors = []

    const userId = wrapType( () => UUID.from( user.user_id ) )

    if ( userId instanceof BaseException ) {
      errors.push( userId )
    }

    const roles: RoleDTO[] = []
    for ( const role of user.roles ) {
      const r = RoleMapper.fromJSON( role )
      if ( r instanceof Errors ) {
        errors.push( ...r.values )
        break
      }
      roles.push( r )
    }

    const name = wrapType( () => ValidString.from( user.name ) )

    if ( name instanceof BaseException ) {
      errors.push( name )
    }

    const email = wrapType( () => Email.from( user.email ) )

    if ( email instanceof BaseException ) {
      errors.push( email )
    }

    const metadata = wrapType( () => ValidJSON.from( user.metadata ) )

    if ( metadata instanceof BaseException ) {
      errors.push( metadata )
    }

    const createdAt = wrapType( () => ValidDate.from( user.created_at ) )

    if ( createdAt instanceof BaseException ) {
      errors.push( createdAt )
    }

    const updatedAt = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), user.updated_at )

    if ( updatedAt instanceof BaseException ) {
      errors.push( updatedAt )
    }

    if ( errors.length ) {
      return new Errors( errors )
    }

    return {
      id   : (
        userId as UUID
      ).toString(),
      name : (
        name as ValidString
      ).value,
      email: (
        email as Email
      ).value,
      metadata: (
        metadata as ValidJSON
      ).value,
      roles: roles,
      created_at: (
        createdAt as ValidDate
      ).toString(),
      updated_at: updatedAt instanceof ValidDate ? updatedAt.toString() : undefined
    }
  }
}
