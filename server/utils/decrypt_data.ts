import { z } from "zod"
import {
  BaseException
}            from "~~/modules/shared/domain/exceptions/base_exception"
import {
  UnknownException
}            from "~~/modules/shared/domain/exceptions/unknown_exception"
import {
  InfrastructureException
}            from "~~/modules/shared/domain/exceptions/infrastructure_exception"

export const cryptSchema = z.object( {
  key : z.string(),
  data: z.string()
} )

export type CryptDTO = z.infer<typeof cryptSchema>

export async function decryptData( privateKeyPem: string, key: string,
  data: string ): Promise<Record<string, any> | BaseException> {
  try {
    if ( !key || !data || !privateKeyPem ) {
      return new InfrastructureException()
    }

    function pemToArrayBuffer( pem: string, headerType = "PRIVATE KEY" ) {
      // const pemHeader = `-----BEGIN ${headerType}-----`;
      // const pemFooter = `-----END ${headerType}-----`;
      // const b64 = pem
      //   .replace(pemHeader, "")
      //   .replace(pemFooter, "")
      //   .replace(/\s/g, "");
      const binaryString = atob( pem )
      const len          = binaryString.length
      const bytes        = new Uint8Array( len )
      for ( let i = 0; i < len; i++ ) {
        bytes[i] = binaryString.charCodeAt( i )
      }
      return bytes.buffer
    }

    const privateKeyBuffer = pemToArrayBuffer( privateKeyPem, "PRIVATE KEY" )
    const rsaPrivateKey    = await crypto.subtle.importKey(
      "pkcs8",
      privateKeyBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      false,
      ["decrypt"]
    )

    function base64ToArrayBuffer( base64: string ) {
      const binaryString = atob( base64 )
      const len          = binaryString.length
      const bytes        = new Uint8Array( len )
      for ( let i = 0; i < len; i++ ) {
        bytes[i] = binaryString.charCodeAt( i )
      }
      return bytes.buffer
    }

    const encryptedAesKeyBuffer = base64ToArrayBuffer( key )

    const aesKeyRaw = await crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      rsaPrivateKey,
      encryptedAesKeyBuffer
    )

    const aesKey = await crypto.subtle.importKey(
      "raw",
      aesKeyRaw,
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    )

    const encryptedDataBuffer = base64ToArrayBuffer( data )

    const iv = new Uint8Array( aesKeyRaw, 0, 16 )

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      aesKey,
      encryptedDataBuffer
    )

    const decryptedData = new TextDecoder().decode( decryptedBuffer )
    return JSON.parse( decryptedData )
  }
  catch ( e ) {
    if ( e instanceof BaseException ) {
      return e
    }
    return new UnknownException()
  }
}
