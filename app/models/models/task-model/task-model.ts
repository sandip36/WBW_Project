import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { createModel } from '../../factories/model.factory'


export const AuditAndInspectionTaskDetailModel = types.model( {
    AuditAndInspectionTaskID: types.maybeNull( types.string ),
    AuditAndInspectionID: types.maybeNull( types.string ),
    Title: types.maybeNull( types.string ),
    Type: types.maybeNull( types.string ),
    DateAssigned: types.maybeNull( types.string ),
    AssignedTo: types.maybeNull( types.string ),
    DueDate: types.maybeNull( types.string ),
    DateCompleted: types.maybeNull( types.string ),
    CompletedBy: types.maybeNull( types.string ),
    Status: types.maybeNull( types.string ),
    AssignedHazardImage: types.maybeNull( types.string ),
    CompletedHazardImage: types.maybeNull( types.string ),
    Comments: types.maybeNull( types.string )
} )

type AuditAndInspectionTaskDetailModelType = Instance<typeof AuditAndInspectionTaskDetailModel>
export interface IAuditAndInspectionTaskDetailModel extends AuditAndInspectionTaskDetailModelType {}
type AuditAndInspectionTaskDetailModelSnapshotType = SnapshotOut<typeof AuditAndInspectionTaskDetailModel>
export interface IAuditAndInspectionTaskDetailModelSnapshot extends AuditAndInspectionTaskDetailModelSnapshotType {}

/**
 * Task model to store task details(Complete or Assign Tasks)
 */
export const TaskModel = createModel( {
    instructions: types.maybeNull( types.string ),
    PreviousHazard: types.maybeNull( types.string ),
    PreviousHazardsID: types.maybeNull( types.string ),
    AuditAndInspectionTaskDetails: types.optional( AuditAndInspectionTaskDetailModel, {} )
} )

type TaskType = Instance<typeof TaskModel>
export interface ITask extends TaskType {}
type TaskSnapshotType = SnapshotOut<typeof TaskModel>
export interface ITaskSnapshot extends TaskSnapshotType {}

