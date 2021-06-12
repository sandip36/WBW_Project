import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { createModel } from '../../factories/model.factory'


/**
 * Dashboard model to store dashboard details
 */
export const DashboardModel = createModel( {
    WorkflowTemplateID: types.maybeNull( types.string ),
    AuditandInspectionTemplateID: types.maybeNull( types.string ),
    CustomFormID: types.maybeNull( types.string ),
    SafetyMeetingID: types.maybeNull( types.string ),
    Title: types.maybeNull( types.string ),
    LevelID: types.maybeNull( types.string ),
    Category: types.maybeNull( types.string ),
    Type: types.maybeNull( types.string ),
    HomePageOrder: types.maybeNull( types.string ),
    IsDefault: types.maybeNull( types.string ),
    UserID: types.maybeNull( types.string ),
    CreatedOn: types.maybeNull( types.string ),
    JHASettingID: types.maybeNull( types.string ),
    ObservationSettingID: types.maybeNull( types.string ),
    Link: types.maybeNull( types.string ),
} )

type DashboardType = Instance<typeof DashboardModel>
export interface IDashboard extends DashboardType {}
type DashboardSnapshotType = SnapshotOut<typeof DashboardModel>
export interface IDashboardSnapshot extends DashboardSnapshotType {}

