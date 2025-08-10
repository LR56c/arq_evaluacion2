import { DomainException } from "./domain_exception"

export class InvalidDateException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidDateException"
  }
}
