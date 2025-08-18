import { Either }  from "fp-ts/Either"
import { SaleDTO } from "./sale_dto"

export abstract class SaleAppService {
  abstract add( sale: SaleDTO ): Promise<boolean>

  abstract update( sale: SaleDTO ): Promise<boolean>

  abstract remove( id: string ): Promise<boolean>

  abstract search(query : string): Promise<SaleDTO[]>
}
