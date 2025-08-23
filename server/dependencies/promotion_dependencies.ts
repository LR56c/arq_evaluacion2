import {
  PrismaPromotionData
}                           from "~~/modules/promotion/infrastructure/prisma_promotion_data"
import prisma               from "~~/lib/prisma"
import {
  AddPromotion
}                           from "~~/modules/promotion/application/add_promotion"
import {
  RemovePromotion
}                           from "~~/modules/promotion/application/remove_promotion"
import {
  SearchPromotion
}                           from "~~/modules/promotion/application/search_promotion"
import {
  UpdatePromotion
}                           from "~~/modules/promotion/application/update_promotion"
import {
  SentryInstrumentation
}                           from "#shared/infrastructure/sentry_instrumentation"
import {
  searchProduct
}                           from "~~/server/dependencies/product_dependencies"
import {
  PromotionInstrumentation
}                           from "~~/server/instrumentation/promotion_instrumentation"
import { PromotionService } from "~~/server/services/promotion_service"

const dao                      = new PrismaPromotionData( prisma )
const add                      = new AddPromotion( dao, searchProduct )
const remove                   = new RemovePromotion( dao )
export const searchPromotion   = new SearchPromotion( dao )
const update                   = new UpdatePromotion( dao, searchProduct )
const promotionLogger          = new SentryInstrumentation( "promotion" )
const promotionInstrumentation = new PromotionInstrumentation( promotionLogger )
export const promotionService  = new PromotionService( add, remove,
  searchPromotion, update,
  promotionInstrumentation )
