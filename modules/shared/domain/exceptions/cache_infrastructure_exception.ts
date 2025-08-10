import { InfrastructureException } from "./infrastructure_exception"

export class CacheInfrastructureException extends InfrastructureException {
  constructor( message?: string ) {
    super( message )
    this.name = "CacheInfrastructureException"
  }
}
