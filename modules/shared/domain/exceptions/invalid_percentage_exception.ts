import { BaseException } from "./base_exception"

export class InvalidPercentageException extends BaseException {
  constructor( message?: string )
  {
    super( message )
    this.name = "InvalidPercentageException"
  }
}
