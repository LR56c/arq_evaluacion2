import { Either }        from "fp-ts/Either"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { UUID }          from "../../shared/domain/value_objects/uuid"
import { ValidInteger }  from "../../shared/domain/value_objects/valid_integer"
import { ValidString }   from "../../shared/domain/value_objects/valid_string"
import { Promotion }     from "./promotion"
import { PaginatedResult } from "../../shared/domain/paginated_result"

export abstract class PromotionDAO {
  abstract add( promotion: Promotion ): Promise<Either<BaseException, boolean>>

  abstract update( promotion: Promotion ): Promise<Either<BaseException, boolean>>

  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>

  abstract search( query: Record<string, any>, limit ?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], PaginatedResult<Promotion>>>
}
