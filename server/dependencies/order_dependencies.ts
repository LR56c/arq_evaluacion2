import prisma           from "~~/lib/prisma"
import {
  PrismaOrderData
}                       from "~~/modules/order/infrastructure/prisma_order_data"
import { AddOrder }     from "~~/modules/order/application/add_order"
import {
  RemoveOrder
}                       from "~~/modules/order/application/remove_order"
import {
  SearchOrder
}                       from "~~/modules/order/application/search_order"
import {
  UpdateOrder
}                       from "~~/modules/order/application/update_order"
import {
  SentryInstrumentation
}                       from "#shared/infrastructure/sentry_instrumentation"
import { searchUser }   from "~~/server/dependencies/user_dependencies"
import {
  OrderInstrumentation
}                       from "~~/server/instrumentation/order_instrumentation"
import { OrderService } from "~~/server/services/order_service"
import {
  searchProduct
}                       from "~~/server/dependencies/product_dependencies"


const dao                 = new PrismaOrderData( prisma )
const add                 = new AddOrder( dao, searchUser, searchProduct )
const remove              = new RemoveOrder( dao )
export const searchOrder   = new SearchOrder( dao )
const update              = new UpdateOrder( dao,searchUser, searchProduct )
const orderLogger          = new SentryInstrumentation( "order" )
const orderInstrumentation = new OrderInstrumentation( orderLogger )
export const orderService  = new OrderService( add, remove, searchOrder, update,
  orderInstrumentation )
