import prisma              from "~~/lib/prisma"
import {
  PrismaShipmentData
}                          from "~~/modules/shipment/infrastructure/prisma_shipment_data"
import {
  AddShipment
}                          from "~~/modules/shipment/application/add_shipment"
import {
  RemoveShipment
}                          from "~~/modules/shipment/application/remove_shipment"
import {
  SearchShipment
}                          from "~~/modules/shipment/application/search_shipment"
import {
  UpdateShipment
}                          from "~~/modules/shipment/application/update_shipment"
import {
  SentryInstrumentation
}                          from "#shared/infrastructure/sentry_instrumentation"
import {
  searchAddress
}                          from "~~/server/dependencies/address_dependencies"
import {
  searchOrder
}                          from "~~/server/dependencies/order_dependencies"
import {
  ShipmentInstrumentation
}                          from "~~/server/instrumentation/shipment_instrumentation"
import { ShipmentService } from "~~/server/services/shipment_service"


const dao                    = new PrismaShipmentData( prisma )
const add                    = new AddShipment( dao, searchAddress,
  searchOrder )
const remove                 = new RemoveShipment( dao )
export const searchShipment  = new SearchShipment( dao )
const update                 = new UpdateShipment( dao, searchAddress,
  searchOrder )
const shipmentLogger          = new SentryInstrumentation( "shipment" )
const shipmentInstrumentation = new ShipmentInstrumentation( shipmentLogger )
export const shipmentService  = new ShipmentService( add, remove, searchShipment,
  update,
  shipmentInstrumentation )
