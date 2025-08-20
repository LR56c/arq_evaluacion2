import * as Sentry from "@sentry/nuxt";
 
Sentry.init({
  dsn: "https://2d54f0f9b2c1f336c188d70a112ce0cc@o4504998055706624.ingest.us.sentry.io/4509878913531904",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
