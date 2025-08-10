import { DomainException } from "./domain_exception"

export class InvalidStringException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidStringException"
  }
}

