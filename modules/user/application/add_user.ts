// import { type Either, isLeft, left, right } from "fp-ts/Either"
// import {
//   SearchRole
// }                                           from "../../role/application/search_role"
// import { UserDAO }                          from "../domain/user_dao"
// import {
//   BaseException
// }                                           from "../../shared/domain/exceptions/base_exception"
// import { wrapType }                         from "../../shared/utils/wrap_type"
// import {
//   UUID
// }                                           from "../../shared/domain/value_objects/uuid"
//
// export class AddUser {
//   constructor(
//     private readonly dao: UserDAO,
//     private readonly searchRole: SearchRole
//   )
//   {
//   }
//
//   private async ensureUserNotExist( id: string ): Promise<Either<BaseException[], boolean>> {
//     const vid = wrapType( () => UUID.from( id ) )
//
//     if ( vid instanceof BaseException ) {
//       return left( [vid] )
//     }
//
//     const existResult = await this.dao.getById( vid as UUID )
//
//     if ( isLeft( existResult ) ) {
//       const notFound = existResult.left.some(
//         error => error instanceof DataNotFoundException )
//       return notFound ? right( true ) : left( existResult.left )
//     }
//
//     if ( existResult.right.userId.toString() === id )
//     {
//       return left( [new DataAlreadyExistException()] )
//     }
//     return right( true )
//   }
//
//   async execute( request: UserRequest ): Promise<Either<BaseException[], User>> {
//
//     const userNotExist = await this.ensureUserNotExist( request.user_id )
//
//     if ( isLeft( userNotExist ) ) {
//       return left( userNotExist.left )
//     }
//
//     const roleResult = await ensureRoles( this.searchRole, request.roles )
//
//     if ( isLeft( roleResult ) ) {
//       return left( roleResult.left )
//     }
//
//     const color = getRandomOKLCHColor()
//     const user  = User.create( request.user_id, request.email, roleResult.right,
//       color, request.name ? request.name : null )
//
//     if ( user instanceof Errors ) {
//       return left( user.values )
//     }
//
//     const result = await this.dao.add( user )
//     if ( isLeft( result ) ) {
//       return left( [result.left] )
//     }
//
//     return right( user )
//   }
// }
