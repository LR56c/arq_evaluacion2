import { wrapTypeAsync }              from "~~/modules/shared/utils/wrap_type"
import { jwtVerify, JWTVerifyResult } from "jose"
import {
  BaseException
}                                     from "~~/modules/shared/domain/exceptions/base_exception"

export const verifyJwt = async ( token: string ): Promise<BaseException | JWTVerifyResult> => {
  const secretKey = useRuntimeConfig().jwt.key
  const secret    = new TextEncoder().encode( secretKey )
  return wrapTypeAsync( () => jwtVerify( token, secret ) )
}
