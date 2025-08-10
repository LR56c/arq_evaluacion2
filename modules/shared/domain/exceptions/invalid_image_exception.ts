import { DomainException } from "./domain_exception"

export class InvalidImageException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidImageException"
  }
}
