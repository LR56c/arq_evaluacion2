import { type Either, left, right } from "fp-ts/Either"
import { wrapTypeDefault }          from "./wrap_type"
import { BaseException }            from "../domain/exceptions/base_exception"
import { ValidString }              from "../domain/value_objects/valid_string"
import { ValidInteger }             from "../domain/value_objects/valid_integer"

type GenericSearch = {
  validLimit?: ValidInteger,
  validSkip?: ValidString,
  validSortBy?: ValidString,
  validSortType?: ValidString
}
export const genericEnsureSearch = ( limit?: number,
  skip ?: string, sortBy ?: string,
  sortType ?: string ): Either<BaseException[], GenericSearch> => {
  const errors     = []
  const validLimit = wrapTypeDefault( undefined,
    ( limit ) => ValidInteger.from( limit ), limit )

  if ( validLimit instanceof BaseException ) {
    errors.push( validLimit )
  }

  const validSkip = wrapTypeDefault( undefined,
    ( value ) => ValidString.from( value ), skip )

  if ( validSkip instanceof BaseException ) {
    errors.push( validSkip )
  }

  const validSortBy = wrapTypeDefault( undefined,
    ( value ) => ValidString.from( value ), sortBy )

  if ( validSortBy instanceof BaseException ) {
    errors.push( validSortBy )
  }

  const validSortType = wrapTypeDefault( undefined,
    ( value ) => ValidString.from( value ), sortType )

  if ( validSortType instanceof BaseException ) {
    errors.push( validSortType )
  }

  if ( errors.length > 0 ) {
    return left( errors )
  }

  return right( {
    validLimit   : validLimit as ValidInteger | undefined,
    validSkip    : validSkip as ValidString | undefined,
    validSortBy  : validSortBy as ValidString | undefined,
    validSortType: validSortType as ValidString | undefined
  } )
}
