import prisma from "~~/lib/prisma"
import {
  AddAddress
}             from "~~/modules/address/application/add_address"
import {
  RemoveAddress
}             from "~~/modules/address/application/remove_address"
import {
  SearchAddress
}             from "~~/modules/address/application/search_address"
import {
  UpdateAddress
}             from "~~/modules/address/application/update_address"
import {
  AddressInstrumentation
}             from "~~/server/instrumentation/address_instrumentation"
import {
  SentryInstrumentation
}             from "~~/shared/infrastructure/sentry_instrumentation"
import {
  PrismaAddressData
}             from "~~/modules/address/infrastructure/prisma_address_data"
import { AddressService } from "~~/server/services/address_service"
import { searchCountry } from "~~/server/dependencies/country_dependencies"
import { searchUser } from "~~/server/dependencies/user_dependencies"

const dao                 = new PrismaAddressData( prisma )
const add                 = new AddAddress( dao, searchCountry, searchUser )
const remove              = new RemoveAddress( dao )
export const searchRole   = new SearchAddress( dao )
const update              = new UpdateAddress( dao, searchCountry )
const addressLogger          = new SentryInstrumentation( "address" )
const addressInstrumentation = new AddressInstrumentation( addressLogger )
export const addressService  = new AddressService( add, remove, searchRole, update,
  addressInstrumentation )
