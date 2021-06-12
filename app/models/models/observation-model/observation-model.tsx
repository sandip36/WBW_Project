import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { createModel } from '../../factories/model.factory'


/**
 * Observation model to store observation details
 */
export const ObservationModel = createModel( {
    id: types.maybe( types.identifierNumber ),
    ObservationID: types.maybeNull( types.number ),
    ObservationGUID: types.maybeNull( types.string ),
    Observation: types.maybeNull( types.string ),
    ObservationNumber: types.maybeNull( types.string ),
    Category: types.maybeNull( types.string ),
    Section: types.maybeNull( types.string ),
    Topic: types.maybeNull( types.string ),
    PreventiveHazard: types.maybeNull( types.string ),
    Hazard: types.maybeNull( types.string ),
    IsFollowUpNeeded: types.maybeNull( types.string ),
    DateCreated: types.maybeNull( types.string ),
    Status: types.maybeNull( types.string ),
    SubmittedBy: types.maybeNull( types.string ),
    ShowManageTask: types.maybeNull( types.string ),
    OutstandingTask: types.maybeNull( types.string ),
    Location: types.maybeNull( types.string ),
    ObservationDate: types.maybeNull( types.string ),
    ObservationTime: types.maybeNull( types.string ),
} )

type ObservationType = Instance<typeof ObservationModel>
export interface IObservation extends ObservationType {}
type ObservationSnapshotType = SnapshotOut<typeof ObservationModel>
export interface IObservationSnapshot extends ObservationSnapshotType {}

