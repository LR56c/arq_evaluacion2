import * as Sentry from "@sentry/nuxt";

Sentry.init({
  dsn: "https://2d54f0f9b2c1f336c188d70a112ce0cc@o4504998055706624.ingest.us.sentry.io/4509878913531904",
  tracesSampleRate: 1.0,
  enableLogs: true,
  debug: false,
});
