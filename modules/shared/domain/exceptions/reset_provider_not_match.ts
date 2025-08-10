import { InfrastructureException } from "./infrastructure_exception"

export class ResetProviderNotMatch extends InfrastructureException {
  constructor( message?: string ) {
    super( message )
    this.name = "ResetProviderNotMatch"
  }
}
