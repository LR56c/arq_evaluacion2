import { SaleDAO } from "../domain/sale_dao"
import { Sale }    from "../domain/sale"
import { Either, right }  from "fp-ts/Either"
import { BaseException }  from "../../shared/domain/exceptions/base_exception"
import { UUID }           from "../../shared/domain/value_objects/uuid"
import { ValidInteger }   from "../../shared/domain/value_objects/valid_integer"
import { ValidString }    from "../../shared/domain/value_objects/valid_string"
import { PrismaClient }   from "@prisma/client"

export class PrismaSaleData implements SaleDAO {
  constructor( private readonly db: PrismaClient ) {
  }
  async add( sale: Sale ): Promise<Either<BaseException, boolean>> {
    return right( true )
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    return right( true )
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], Sale[]>> {
    return right( [] )
  }

  async update( sale: Sale ): Promise<Either<BaseException, boolean>> {
    return right( true )
  }

}