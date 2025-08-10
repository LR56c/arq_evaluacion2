import { DomainException } from "./domain_exception"

export class EmailException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "EmailException"
  }
}
