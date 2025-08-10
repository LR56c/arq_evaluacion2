import { BaseException } from "./base_exception"

export class InfrastructureException extends BaseException {
  constructor( message?: string ) {
    super( message )
    this.name = "InfrastructureException"
  }
}
