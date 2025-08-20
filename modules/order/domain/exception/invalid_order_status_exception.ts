import {
  DomainException
} from "../../../shared/domain/exceptions/domain_exception"
export class InvalidOrderStatusException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidOrderStatusException"
  }
}
