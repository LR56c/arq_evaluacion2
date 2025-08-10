import { DomainException } from "./domain_exception"

export class InvalidIntegerException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidIntegerException"
  }
}
