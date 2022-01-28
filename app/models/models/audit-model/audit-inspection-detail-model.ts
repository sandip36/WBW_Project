import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { PrimaryUserListModel } from "models/models/audit-model/primary-user-list-model";

export const ReportingPeriodDueDatesModel = types.model( {
    ID: types.maybeNull( types.string ),
    Value: types.maybeNull( types.string )
} )

export const AuditAndInspectionDetailsModel = types 
    .model( {
        AuditAndInspectionID: types.maybeNull( types.string ),
        AuditAndInspectionNumber: types.maybeNull( types.string ),
        ScoringLable: types.maybeNull( types.string ),
        IsDisplayHazardList: types.maybeNull( types.string ),
        IsDisplaySource: types.maybeNull( types.string ),
        IsSchedulerRequired: types.maybeNull( types.string ),
        IsAdhocTaskAllowed: types.maybeNull( types.string ),
        TypeID: types.maybeNull( types.string ),
        TypeName: types.maybeNull( types.string ),
        Notes: types.maybeNull( types.string ),
        ReportingPeriodDueDates: types.optional( types.array( ReportingPeriodDueDatesModel ), [] ),
        ReportingPeriodDueDateSelected: types.maybeNull( types.string ),
        NextDueDate: types.maybeNull( types.string ),
        SkippedDueDate: types.maybeNull( types.string ),
        SkippedReason: types.maybeNull( types.string ),
        IsAllowCheckAll: types.maybeNull( types.string ),
        IsAllowAdhoc: types.maybeNull( types.string ),
        CheckListStatus: types.maybeNull( types.string ),
        AuditAndInspectionStatus: types.maybeNull( types.string ),
        ScheduleFrequency: types.maybeNull( types.string ),
        AuditAndInspectionCategory: types.maybeNull( types.string ),
        AdhocWarnigMessage: types.maybeNull( types.string ),
        PrimaryUserList: types.optional( types.array( PrimaryUserListModel ), [] ),
        PrimaryUserID: types.maybeNull( types.string ),
    } )

export type AuditAndInspectionDetailsType = Instance<typeof AuditAndInspectionDetailsModel>
export interface IAuditAndInspectionDetails extends AuditAndInspectionDetailsType {}
type AuditAndInspectionDetailsSnapshotType = SnapshotOut<typeof AuditAndInspectionDetailsModel>
export interface IAuditAndInspectionDetailsType extends AuditAndInspectionDetailsSnapshotType {}
