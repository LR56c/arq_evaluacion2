import { UUID } from "../../shared/domain/value_objects/uuid"
import { ValidString } from "../../shared/domain/value_objects/valid_string"
import { ValidInteger } from "../../shared/domain/value_objects/valid_integer"
import { ValidURL } from "../../shared/domain/value_objects/valid_url"
import { ValidDate } from "../../shared/domain/value_objects/valid_date"
import { Sale } from "../../sales/domain/sale"

export class Product {
	constructor(
		readonly id: UUID,
		readonly name: ValidString,
		readonly description: ValidString,
		readonly price: ValidInteger,
		readonly stock: ValidInteger,
		readonly imageUrl: ValidURL,
		readonly createdAt: ValidDate,
		readonly updatedAt?: ValidDate,
		readonly sale?: Sale
	)
	{}
}
