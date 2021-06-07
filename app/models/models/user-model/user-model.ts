import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { createModel } from '../../factories/model.factory'


/**
 * User model to store user details
 */
export const UserModel = createModel( {
    UserID: types.maybeNull( types.string ),
    FirstName: types.maybeNull( types.string ),
    LastName: types.maybeNull( types.string ),
    FullName: types.maybeNull( types.string ),
    UserName: types.maybeNull( types.string ),
    EmailAddress: types.maybeNull( types.string ),
    AccessToken: types.maybeNull( types.string ),
    LevelID: types.maybeNull( types.string ),
    CompanyID: types.maybeNull( types.string ),
    CompanyName: types.maybeNull( types.string ),
    LevelName: types.maybeNull( types.string ),
} )

type UserType = Instance<typeof UserModel>
export interface IUser extends UserType {}
type UserSnapshotType = SnapshotOut<typeof UserModel>
export interface IUserSnapshot extends UserSnapshotType {}

