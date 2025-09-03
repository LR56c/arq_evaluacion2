import { SignJWT } from "jose"

export const signJwt = async ( body: Record<string, any> ): Promise<string> => {
  const secretKey = useRuntimeConfig().jwt.key
  const secret    = new TextEncoder().encode( secretKey )

  return await new SignJWT( body )
    .setProtectedHeader( { alg: "HS256", typ: "JWT" } )
    .setExpirationTime( "1h" )
    .setIssuedAt()
    .sign( secret )
}
