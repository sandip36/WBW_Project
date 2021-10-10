import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { PrimaryUserListModel } from "./primary-user-list-model";

export const GetTypesModelForStartInspection = types 
    .model( {
        TypeID: types.maybeNull( types.string ),
        Name: types.maybeNull( types.string ),
        IsDefault: types.maybeNull( types.string ),
        IsPrimary: types.maybeNull( types.string ),
        PrimaryUserList: types.optional( types.array( PrimaryUserListModel ), [] )
    } )

export type GetTypesModelForStartInspectionType = Instance<typeof GetTypesModelForStartInspection>
export interface IGetTypesModelForStartInspection extends GetTypesModelForStartInspectionType {}
type GetTypesModelForStartInspectionSnapshotType = SnapshotOut<typeof GetTypesModelForStartInspection>
export interface IGetTypesModelForStartInspectionSnapshotTypeType extends GetTypesModelForStartInspectionSnapshotType {}
