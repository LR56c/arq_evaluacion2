import { PromotionDAO }  from "../domain/promotion_dao"
import { PrismaClient }  from "@prisma/client"
import { Promotion }     from "../domain/promotion"
import { Either, right } from "fp-ts/Either"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { UUID }          from "../../shared/domain/value_objects/uuid"
import { ValidInteger }  from "../../shared/domain/value_objects/valid_integer"
import { ValidString }   from "../../shared/domain/value_objects/valid_string"
import { PaginatedResult } from "../../shared/domain/paginated_result"

export class PrismaPromotionData implements PromotionDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( promotion: Promotion ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction([
        this.db.promotion.create( {
          data: {
            id         : promotion.id.toString(),
            name       : promotion.name.value,
            percentage: promotion.percentage.value,
            startDate  : promotion.startDate.toString(),
            endDate    : promotion.endDate.toString(),
            isActive : promotion.isActive.value,
            createdAt  : promotion.createdAt.toString(),
            description: promotion.description?.value,
          }
        } ),
        this.db.promotionProduct.createMany( {
          data: promotion.products.map( product => ( {
            promotionId: promotion.id.toString(),
            quantity: product.quantity.value,
            productId  : promotion.id.toString()
          } ) )
        } ),
      ])
      return right( true )
    }
    catch ( error ) {
      return right( false )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    return right( true )
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<Promotion>>> {
    return right( {
      items: [],
      total: 0,
    } )
  }

  async update( promotion: Promotion ): Promise<Either<BaseException, boolean>> {
    return right( true )
  }


}