import { DomainException } from "./domain_exception"

export class InvalidBigIntegerException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidBigIntegerException"
  }
}
