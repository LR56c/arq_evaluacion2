import { UUID } from "../../shared/domain/value_objects/uuid"
import { ValidString } from "../../shared/domain/value_objects/valid_string"
import { Email } from "../../shared/domain/value_objects/email"
import { ValidDate }                 from "../../shared/domain/value_objects/valid_date"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"
import { Errors }                    from "../../shared/domain/exceptions/errors"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { Role } from "../../role/domain/role"
import { ValidJSON } from "../../shared/domain/json_schema"

export class User {
  private constructor(
    readonly id: UUID,
    readonly name: ValidString,
    readonly email: Email,
    readonly metadata: ValidJSON,
    readonly roles: Role[],
    readonly createdAt: ValidDate,
    readonly updatedAt?: ValidDate
  ) {
  }

  static create(
    id: string,
    name: string,
    email: string,
    metadata: Record<string, any>,
    roles: Role[],
  ): User {
    return User.fromPrimitives( id, name, email, metadata, roles, ValidDate.nowUTC(), null ) as User
  }

  static fromPrimitivesThrow(
    id: string,
    name: string,
    email: string,
    metadata: Record<string, any>,
    roles: Role[],
    createdAt: Date | string,
    updatedAt: Date | string | null
  ): User {
    return new User(
      UUID.from( id ),
      ValidString.from( name ),
      Email.from( email ),
      ValidJSON.from( metadata ),
      roles,
      ValidDate.from( createdAt ),
      updatedAt ? ValidDate.from( updatedAt ) : undefined
    )
  }

  static fromPrimitives(
    id: string,
    name: string,
    email: string,
    metadata: Record<string, any>,
    roles: Role[],
    createdAt: Date | string,
    updatedAt: Date | string | null
  ): User | Errors {
   const errors = []

    const _id = wrapType(()=>UUID.from( id ))

    if ( _id instanceof BaseException ) {
      errors.push( _id )
    }
    const _name = wrapType( () => ValidString.from( name ) )

    if ( _name instanceof BaseException ) {
      errors.push( _name )
    }

    const _email = wrapType( () => Email.from( email ) )

    if ( _email instanceof BaseException ) {
      errors.push( _email )
    }

    const _createdAt = wrapType( () => ValidDate.from( createdAt ) )

    if ( _createdAt instanceof BaseException ) {
      errors.push( _createdAt )
    }

    const _updatedAt = wrapTypeDefault(undefined, (value) =>  ValidDate.from( value ) , updatedAt )

    if ( _updatedAt instanceof BaseException ) {
      errors.push( _updatedAt )
    }

    const _metadata = wrapType( () => ValidJSON.from( metadata ) )

    if ( _metadata instanceof BaseException ) {
      errors.push( _metadata )
    }

    if ( errors.length > 0 ) {
      return  new Errors( errors )
    }

    return new User(
      _id as UUID,
      _name as ValidString,
      _email as Email,
      _metadata as ValidJSON,
      roles,
      _createdAt as ValidDate,
      _updatedAt as ValidDate | undefined
    )
  }
}