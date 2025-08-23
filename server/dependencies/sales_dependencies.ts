import {
  SentryInstrumentation
}                      from "~~/shared/infrastructure/sentry_instrumentation"
import {
  PrismaSaleData
}                      from "~~/modules/sales/infrastructure/prisma_sale_data"
import { AddSale }     from "~~/modules/sales/application/add_sale"
import { RemoveSale }  from "~~/modules/sales/application/remove_sale"
import { SearchSale }  from "~~/modules/sales/application/search_sale"
import { UpdateSale }  from "~~/modules/sales/application/update_sale"
import {
  searchProduct
}                      from "~~/server/dependencies/product_dependencies"
import prisma          from "~~/lib/prisma"
import { SaleService } from "~~/server/services/sale_service"
import {
  SaleInstrumentation
}                      from "~~/server/instrumentation/sale_instrumentation"

const dao                 = new PrismaSaleData( prisma )
const add                 = new AddSale( dao, searchProduct )
const remove              = new RemoveSale( dao )
export const searchSale   = new SearchSale( dao )
const update              = new UpdateSale( dao )
const saleLogger          = new SentryInstrumentation( "sale" )
const saleInstrumentation = new SaleInstrumentation( saleLogger )
export const saleService  = new SaleService( add, remove, searchSale, update,
  saleInstrumentation )
