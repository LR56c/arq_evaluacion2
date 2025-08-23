import { CountryService } from "~~/server/services/country_service"
import {
  CountryInstrumentation
}                         from "~~/server/instrumentation/country_instrumentation"
import {
  SentryInstrumentation
}                         from "#shared/infrastructure/sentry_instrumentation"
import {
  SearchCountry
}                         from "~~/modules/country/application/search_country"
import {
  PrismaCountryData
}                         from "~~/modules/country/infrastructure/prisma_country_data"
import prisma             from "~~/lib/prisma"

const dao                    = new PrismaCountryData( prisma )
export const searchCountry                 = new SearchCountry( dao )
const countryLogger          = new SentryInstrumentation( "country" )
const countryInstrumentation = new CountryInstrumentation( countryLogger )
export const countryService  = new CountryService( searchCountry,
  countryInstrumentation )
