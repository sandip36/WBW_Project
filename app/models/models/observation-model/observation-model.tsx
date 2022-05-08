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

export const LocationsModel = types.model( {
    ID: types.maybeNull( types.string ),
    Value: types.maybeNull( types.string )
} )

export type LocationsType = Instance<typeof LocationsModel>
export interface ILocationsModel extends LocationsType {}
type LocationsSnapshotType = SnapshotOut<typeof LocationsModel>
export interface IILocationsModelType extends LocationsSnapshotType {}

export const SectionsModel = types.model( {
    ID: types.maybeNull( types.string ),
    Value: types.maybeNull( types.string ),
    Topics:types.optional( types.array( LocationsModel ),[] ),
} )

export type SectionsType = Instance<typeof LocationsModel>
export interface ISections extends SectionsType {}
type SectionsSnapshotType = SnapshotOut<typeof LocationsModel>
export interface IGSectionsType extends SectionsSnapshotType {}

export const GetAllfiltersModel =  types.model( {
    Sections:types.optional( types.array( SectionsModel ),[] ),
    Hazards:types.optional( types.array( LocationsModel ),[] ),
    ObservationTime:types.optional( types.array( LocationsModel ),[] ),
    ActOrConditions:types.optional( types.array( LocationsModel ),[] ),
    Locations:types.optional( types.array( LocationsModel ),[] ),
} )

export type GetAllfiltersType = Instance<typeof GetAllfiltersModel>
export interface IGetAllfiltersns extends GetAllfiltersType {}
type GetAllfiltersSnapshotType = SnapshotOut<typeof GetAllfiltersModel>
export interface IGetAllfiltersModelType extends GetAllfiltersSnapshotType {}



export const EditObservationModel = types.model( {
    ObservationID: types.maybeNull( types.number ),
    ObservationGUID: types.maybeNull( types.string ),
    Observation: types.maybeNull( types.string ),
    CategoryID: types.maybeNull( types.string ),
    SectionID: types.maybeNull( types.string ),
    TopicID: types.maybeNull( types.string ),
    PreventiveHazardID: types.maybeNull( types.string ),
    HazardID: types.maybeNull( types.string ),
    IsFollowUpNeeded: types.maybeNull( types.string ),
    DateCreated: types.maybeNull( types.string ),
    Status: types.maybeNull( types.string ),
    LevelID: types.maybeNull( types.string ),
    ObservationDate: types.maybeNull( types.string ),
    ObservationTime: types.maybeNull( types.string ),
    DescribeWhereTheIncidentHappened: types.maybeNull( types.string ),
} )

export type EditObservationType = Instance<typeof EditObservationModel>
export interface IEditObservationModel extends EditObservationType {}
type EditObservationSnapshotType = SnapshotOut<typeof EditObservationModel>
export interface IEEditObservationModelType extends EditObservationSnapshotType {}


