import { InfrastructureException } from "./infrastructure_exception"

export class DataAlreadyExistException extends InfrastructureException {
  constructor( message?: string ) {
    super( message )
    this.name = "DataAlreadyExistException"
  }
}
