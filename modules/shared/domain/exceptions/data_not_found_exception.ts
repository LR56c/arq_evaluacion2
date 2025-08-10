import { InfrastructureException } from "./infrastructure_exception"

export class DataNotFoundException extends InfrastructureException {
  constructor( message?: string ) {
    super( message )
    this.name = "DataNotFoundException"
  }
}
