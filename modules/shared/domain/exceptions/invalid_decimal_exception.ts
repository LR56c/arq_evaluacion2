import { DomainException } from "./domain_exception"

export class InvalidDecimalException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidDecimalException"
  }
}
