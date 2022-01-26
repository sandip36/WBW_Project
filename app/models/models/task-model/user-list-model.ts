import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { createModel } from '../../factories/model.factory'

/**
 * Task model to store task rating details(Assign Tasks)
 */
export const UserListModel = createModel( {
    FullName: types.maybe( types.string ),
    UserID: types.maybe( types.string ),
    LevelName: types.maybe( types.string ),
    LevelID: types.maybe( types.string )
} )

type UserListType = Instance<typeof UserListModel>
export interface IUserList extends UserListType {}
type UserListSnapshotType = SnapshotOut<typeof UserListModel>
export interface UserListSnapshot extends UserListSnapshotType {}
