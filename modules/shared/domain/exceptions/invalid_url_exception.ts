import { BaseException } from "./base_exception"

export class InvalidURLException extends BaseException {
  constructor( message?: string )
  {
    super( message )
    this.name = "InvalidURLException"
  }
}

