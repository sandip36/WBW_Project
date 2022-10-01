import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { createModel } from '../../factories/model.factory'


/**
 */
export const UserListByCompanymodel = createModel( {
    UserID: types.maybeNull( types.string ),
    FirstName: types.maybeNull( types.string ),
    LastName: types.maybeNull( types.string ),
    FullName: types.maybeNull( types.string ),
    LevelName: types.maybeNull( types.string ),
    LevelID: types.maybeNull( types.string ),
    Role: types.maybeNull( types.string ),
    Department: types.maybeNull( types.string ),
    Supervisor: types.maybeNull( types.string ),
    AreaManager: types.maybeNull( types.string )

} )


type UserListByCompanyType = Instance<typeof UserListByCompanymodel>
export interface IMedia extends UserListByCompanyType {}
type UserListByCompanySnapshotType = SnapshotOut<typeof UserListByCompanymodel>
export interface IMediaSnapshot extends UserListByCompanySnapshotType {}

export const CompanyUserListmodel = types.model( {
    
    UserID: types.maybeNull( types.string ),
    FirstName: types.maybeNull( types.string ),
    LastName: types.maybeNull( types.string ),
    FullName: types.maybeNull( types.string ),
    LevelName: types.maybeNull( types.string ),
    LevelID: types.maybeNull( types.string ),
    Role: types.maybeNull( types.string ),
    Department: types.maybeNull( types.string ),
    Supervisor: types.maybeNull( types.string ),
    AreaManager: types.maybeNull( types.string ),
} )

export type CompanyUserListmodelType = Instance<typeof CompanyUserListmodel>
export interface ICompanyUserListmodel extends CompanyUserListmodelType {}
type CompanyUserListmodelSnapshotType = SnapshotOut<typeof CompanyUserListmodel>
export interface IICompanyUserListmodelType extends CompanyUserListmodelSnapshotType {}