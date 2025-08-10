import { DomainException } from "./domain_exception"

export class InvalidBooleanException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidBooleanException"
  }
}
