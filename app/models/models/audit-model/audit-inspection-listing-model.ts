import { Instance, SnapshotOut, types } from "mobx-state-tree";

export const AuditAndInspectionListingModel = types 
    .model( {
        LinkText: types.maybeNull( types.string ),
        FullName: types.maybeNull( types.string ),
        RecordNumber: types.maybeNull( types.string ),
        LastDayOfSchedulePeriod: types.maybeNull( types.string ),
        Status: types.maybeNull( types.string ),
        Tasks: types.maybeNull( types.string ),
        IsOutstandingTaskRequired: types.maybeNull( types.string ),
        AuditAndInspectionFor: types.maybeNull( types.string ),
        Work_Site_Name_Value: types.maybeNull( types.string ),
        AuditAndInspectionID: types.maybeNull( types.string ),
        AddDateTime: types.maybeNull( types.string ),
        CompletedDateTime: types.maybeNull( types.string )
    } )

export type AuditAndInspectionListingType = Instance<typeof AuditAndInspectionListingModel>
export interface IAuditAndInspectionListing extends AuditAndInspectionListingType {}
type AuditAndInspectionListingSnapshotType = SnapshotOut<typeof AuditAndInspectionListingModel>
export interface IAuditAndInspectionListingType extends AuditAndInspectionListingSnapshotType {}
