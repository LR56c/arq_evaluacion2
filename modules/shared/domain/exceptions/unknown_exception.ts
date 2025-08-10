import { DomainException } from "./domain_exception"

export class UnknownException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "UnknownException"
  }
}
