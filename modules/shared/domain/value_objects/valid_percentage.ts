import { z } from "zod"
import {
  InvalidPercentageException
}            from "../exceptions/invalid_percentage_exception"


export const percetageSchema = z.number()
                                .min( 0 )
                                .max( 100 )

export class ValidPercentage {
  readonly value: number

  private constructor( value: number ) {
    this.value = value
  }

  /**
   * Create a ValidInteger instance
   * @throws {InvalidPercentageException} - if number is invalid
   */
  static from( value: number ): ValidPercentage {
    const n      = Number( value )
    const result = percetageSchema
      .safeParse( n )
    if ( result.success === false ) {
      throw new InvalidPercentageException()
    }
    return new ValidPercentage( n )
  }
}


