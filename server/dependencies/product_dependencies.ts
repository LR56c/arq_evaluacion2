import prisma             from "~~/lib/prisma"
import {
  PrismaProductData
}                         from "~~/modules/product/infrastructure/prisma_product_data"
import {
  AddProduct
}                         from "~~/modules/product/application/add_product"
import {
  searchUser
}                         from "~~/server/dependencies/user_dependencies"
import {
  searchSale
}                         from "~~/server/dependencies/sales_dependencies"
import {
  RemoveProduct
}                         from "~~/modules/product/application/remove_product"
import {
  SearchProduct
}                         from "~~/modules/product/application/search_product"
import {
  UpdateProduct
}                         from "~~/modules/product/application/update_product"
import {
  SentryInstrumentation
}                         from "#shared/infrastructure/sentry_instrumentation"
import { ProductService } from "~~/server/services/product_service"
import {
  ProductInstrumentation
}                         from "~~/server/instrumentation/product_instrumentation"


const dao                    = new PrismaProductData( prisma )
const add                    = new AddProduct( dao, searchUser, searchSale )
const remove                 = new RemoveProduct( dao )
export const searchProduct   = new SearchProduct( dao )
const update                 = new UpdateProduct( dao, searchUser, searchSale )
const productLogger          = new SentryInstrumentation( "product" )
const productInstrumentation = new ProductInstrumentation( productLogger )
export const productService  = new ProductService( add, remove, searchProduct,
  update,
  productInstrumentation )
