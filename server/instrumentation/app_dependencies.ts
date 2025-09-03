import {
  SentryInstrumentation
}                from "~~/shared/infrastructure/sentry_instrumentation"

export const appLogger = new SentryInstrumentation( "app" )

