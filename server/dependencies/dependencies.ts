import {
  PrismaAddressData
}                           from "~~/modules/address/infrastructure/prisma_address_data"
import prisma               from "~~/lib/prisma"
import {
  AddAddress
}                           from "~~/modules/address/application/add_address"
import {
  RemoveAddress
}                           from "~~/modules/address/application/remove_address"
import {
  SearchAddress
}                           from "~~/modules/address/application/search_address"
import {
  UpdateAddress
}                           from "~~/modules/address/application/update_address"
import {
  SentryInstrumentation
}                           from "#shared/infrastructure/sentry_instrumentation"
import {
  AddressInstrumentation
}                           from "~~/server/instrumentation/address_instrumentation"
import { AddressService }   from "~~/server/services/address_service"
import {
  PrismaUserData
}                           from "~~/modules/user/infrastructure/prisma_user_data"
import {
  UserInstrumentation
}                           from "~~/server/instrumentation/user_instrumentation"
import { UserService }      from "~~/server/services/user_service"
import {
  PrismaRoleData
}                           from "~~/modules/role/infrastructure/prisma_role_data"
import { AddRole }          from "~~/modules/role/application/add_role"
import { RemoveRole }       from "~~/modules/role/application/remove_role"
import { SearchRole }       from "~~/modules/role/application/search_role"
import { UpdateRole }       from "~~/modules/role/application/update_role"
import {
  RoleInstrumentation
}                           from "~~/server/instrumentation/role_instrumentation"
import { RoleService }      from "~~/server/services/role_service"
import {
  PrismaCountryData
}                           from "~~/modules/country/infrastructure/prisma_country_data"
import { SearchCountry }    from "~~/modules/country/application/search_country"
import {
  CountryInstrumentation
}                           from "~~/server/instrumentation/country_instrumentation"
import { CountryService }   from "~~/server/services/country_service"
import {
  PrismaOrderData
}                           from "~~/modules/order/infrastructure/prisma_order_data"
import { AddOrder }         from "~~/modules/order/application/add_order"
import { RemoveOrder }      from "~~/modules/order/application/remove_order"
import { SearchOrder }      from "~~/modules/order/application/search_order"
import { UpdateOrder }      from "~~/modules/order/application/update_order"
import {
  PrismaProductData
}                           from "~~/modules/product/infrastructure/prisma_product_data"
import { AddProduct }       from "~~/modules/product/application/add_product"
import { RemoveProduct }    from "~~/modules/product/application/remove_product"
import { SearchProduct }    from "~~/modules/product/application/search_product"
import { UpdateProduct }    from "~~/modules/product/application/update_product"
import {
  ProductInstrumentation
}                           from "~~/server/instrumentation/product_instrumentation"
import { ProductService }   from "~~/server/services/product_service"
import {
  OrderInstrumentation
}                           from "~~/server/instrumentation/order_instrumentation"
import { OrderService }     from "~~/server/services/order_service"
import {
  PrismaPromotionData
}                           from "~~/modules/promotion/infrastructure/prisma_promotion_data"
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
  PromotionInstrumentation
}                           from "~~/server/instrumentation/promotion_instrumentation"
import { PromotionService } from "~~/server/services/promotion_service"
import {
  PrismaSaleData
}                           from "~~/modules/sales/infrastructure/prisma_sale_data"
import { AddSale }          from "~~/modules/sales/application/add_sale"
import { RemoveSale }       from "~~/modules/sales/application/remove_sale"
import { SearchSale }       from "~~/modules/sales/application/search_sale"
import { UpdateSale }       from "~~/modules/sales/application/update_sale"
import {
  SaleInstrumentation
}                           from "~~/server/instrumentation/sale_instrumentation"
import { SaleService }      from "~~/server/services/sale_service"
import {
  PrismaShipmentData
}                           from "~~/modules/shipment/infrastructure/prisma_shipment_data"
import { AddShipment }      from "~~/modules/shipment/application/add_shipment"
import {
  RemoveShipment
}                           from "~~/modules/shipment/application/remove_shipment"
import {
  SearchShipment
}                           from "~~/modules/shipment/application/search_shipment"
import {
  UpdateShipment
}                           from "~~/modules/shipment/application/update_shipment"
import {
  ShipmentInstrumentation
}                           from "~~/server/instrumentation/shipment_instrumentation"
import { ShipmentService }  from "~~/server/services/shipment_service"
import {
  AddUser
}                           from "~~/modules/user/application/use_cases/add_user"
import {
  SearchUser
}                           from "~~/modules/user/application/use_cases/search_user"
import {
  RemoveUser
}                           from "~~/modules/user/application/use_cases/remove_user"
import {
  UpdateUser
}                           from "~~/modules/user/application/use_cases/update_user"

const roleData            = new PrismaRoleData( prisma )
const addRole             = new AddRole( roleData )
const removeRole          = new RemoveRole( roleData )
const searchRole          = new SearchRole( roleData )
const updateRole          = new UpdateRole( roleData )
const roleLogger          = new SentryInstrumentation( "role" )
const roleInstrumentation = new RoleInstrumentation( roleLogger )
export const roleService  = new RoleService( addRole, removeRole, searchRole,
  updateRole,
  roleInstrumentation )

const userData            = new PrismaUserData( prisma )
const addUser             = new AddUser( userData, searchRole )
const searchUser          = new SearchUser( userData )
const removeUser          = new RemoveUser( userData )
const updateUser          = new UpdateUser( userData, searchRole )
const userLogger          = new SentryInstrumentation( "user" )
const userInstrumentation = new UserInstrumentation( userLogger )
export const userService  = new UserService( addUser, searchUser, removeUser,
  updateUser,
  userInstrumentation )

const countryData            = new PrismaCountryData( prisma )
const searchCountry          = new SearchCountry( countryData )
const countryLogger          = new SentryInstrumentation( "country" )
const countryInstrumentation = new CountryInstrumentation( countryLogger )
export const countryService  = new CountryService( searchCountry,
  countryInstrumentation )

const addressData            = new PrismaAddressData( prisma )
const addAddress             = new AddAddress( addressData, searchCountry,
  searchUser )
const removeAddress          = new RemoveAddress( addressData )
const searchAddress          = new SearchAddress( addressData )
const updateAddress          = new UpdateAddress( addressData, searchCountry )
const addressLogger          = new SentryInstrumentation( "address" )
const addressInstrumentation = new AddressInstrumentation( addressLogger )
export const addressService  = new AddressService( addAddress, removeAddress,
  searchAddress, updateAddress,
  addressInstrumentation )

const saleData   = new PrismaSaleData( prisma )
const searchSale = new SearchSale( saleData )

const productData            = new PrismaProductData( prisma )
const searchProduct          = new SearchProduct( productData )
const addProduct             = new AddProduct( productData, searchUser,
  searchSale )
const removeProduct          = new RemoveProduct( productData )
const updateProduct          = new UpdateProduct( productData, searchUser,
  searchSale )
const productLogger          = new SentryInstrumentation( "product" )
const productInstrumentation = new ProductInstrumentation( productLogger )
export const productService  = new ProductService( addProduct, removeProduct,
  searchProduct,
  updateProduct,
  productInstrumentation )

const addSale             = new AddSale( saleData, searchProduct )
const removeSale          = new RemoveSale( saleData )
const updateSale          = new UpdateSale( saleData )
const saleLogger          = new SentryInstrumentation( "sale" )
const saleInstrumentation = new SaleInstrumentation( saleLogger )
export const saleService  = new SaleService( addSale, removeSale, searchSale,
  updateSale,
  saleInstrumentation )


const orderData            = new PrismaOrderData( prisma )
const addOrder             = new AddOrder( orderData, searchUser,
  searchProduct )
const removeOrder          = new RemoveOrder( orderData )
const searchOrder          = new SearchOrder( orderData )
const updateOrder          = new UpdateOrder( orderData, searchUser,
  searchProduct )
const orderLogger          = new SentryInstrumentation( "order" )
const orderInstrumentation = new OrderInstrumentation( orderLogger )
export const orderService  = new OrderService( addOrder, removeOrder,
  searchOrder, updateOrder,
  orderInstrumentation )

const promotionData            = new PrismaPromotionData( prisma )
const addPromotion             = new AddPromotion( promotionData,
  searchProduct )
const removePromotion          = new RemovePromotion( promotionData )
const searchPromotion          = new SearchPromotion( promotionData )
const updatePromotion          = new UpdatePromotion( promotionData,
  searchProduct )
const promotionLogger          = new SentryInstrumentation( "promotion" )
const promotionInstrumentation = new PromotionInstrumentation( promotionLogger )
export const promotionService  = new PromotionService( addPromotion,
  removePromotion,
  searchPromotion, updatePromotion,
  promotionInstrumentation )

const shipmentData            = new PrismaShipmentData( prisma )
const addShipment             = new AddShipment( shipmentData, searchAddress,
  searchOrder )
const removeShipment          = new RemoveShipment( shipmentData )
const searchShipment          = new SearchShipment( shipmentData )
const updateShipment          = new UpdateShipment( shipmentData, searchAddress,
  searchOrder )
const shipmentLogger          = new SentryInstrumentation( "shipment" )
const shipmentInstrumentation = new ShipmentInstrumentation( shipmentLogger )
export const shipmentService  = new ShipmentService( addShipment,
  removeShipment, searchShipment,
  updateShipment,
  shipmentInstrumentation )
