import { Instrumentation } from "~~/modules/shared/domain/instrumentation"
import * as Sentry         from "@sentry/nuxt"

export class SentryInstrumentation implements Instrumentation {
  constructor(origin : string, email ?: string ) {
    Sentry.setUser( {
      email
    } )
  }

  async error( message: string, extra?: Record<string, any>,
    exception?: Error ): Promise<void> {
    if ( extra ) {
      Sentry.setContext( "extra", extra )
    }
    Sentry.captureMessage( message, "error" )
  }

  async log( message: string, extra?: Record<string, any> ): Promise<void> {
    if ( extra ) {
      Sentry.setContext( "extra", extra )
    }
    Sentry.captureMessage( message, "info" )
  }


  async trace<T>( operation: string, name: string,
    callback: () => T ): Promise<T> {
    return await Sentry.startSpan( { name, op: operation }, async ( span ) => {
      return callback()
    } )
  }

  async warning( message: string,
    extra?: Record<string, any> ): Promise<void> {
    if ( extra ) {
      Sentry.setContext( "extra", extra )
    }
    Sentry.captureMessage( message, "warning" )
  }
}
