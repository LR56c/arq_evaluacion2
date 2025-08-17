import { UUID }      from "../../shared/domain/value_objects/uuid"
import {
  ValidPercentage
}                    from "../../shared/domain/value_objects/valid_percentage"
import { ValidDate } from "../../shared/domain/value_objects/valid_date"
import { ValidBool } from "../../shared/domain/value_objects/valid_bool"

export class Sale {
  constructor(
    readonly id: UUID,
    readonly percentage: ValidPercentage,
    readonly startDate: ValidDate,
    readonly endDate: ValidDate,
    readonly isActive: ValidBool,
    readonly createdAt: ValidDate,
    readonly productId: UUID,
  )
  {
  }
}
