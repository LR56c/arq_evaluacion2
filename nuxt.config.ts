// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"
import Aura        from "@primeuix/themes/aura"

export default defineNuxtConfig( {
  compatibilityDate: "2025-07-15",
  devtools         : { enabled: true },
  modules          : [
    "vue-mess-detector-nuxt-devtools",
    "@prisma/nuxt",
    "@vee-validate/nuxt",
    "@primevue/nuxt-module",
    "@peterbud/nuxt-query",
    "@vueuse/nuxt",
    "nuxt-security",
    "@nuxt/icon"
  ],
  nuxtQuery        : {
    autoImports: ["useQuery"]
  },
  css              : ["../assets/css/main.css", "primeicons/primeicons.css"],
  vite             : {
    plugins: [
      tailwindcss()
    ]
  },
  primevue         : {
    options: {
      theme: {
        preset : Aura,
        options:
          {
            darkModeSelector: "[theme=\"dark\"]"
          }
      }
    }
  },
  build            : {
    transpile: ["fp-ts"]
  }
} )