import { Sale } from "./sale"
import { Either } from "fp-ts/Either"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { UUID } from "../../shared/domain/value_objects/uuid"
import { ValidInteger } from "../../shared/domain/value_objects/valid_integer"
import { ValidString } from "../../shared/domain/value_objects/valid_string"

export abstract class SaleDAO {
  abstract add( sale: Sale ): Promise<Either<BaseException, boolean>>

  abstract update( sale: Sale ): Promise<Either<BaseException, boolean>>

  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>

  abstract search( query: Record<string, any>, limit ?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], Sale[]>>
}
