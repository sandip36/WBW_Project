import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { GetTypesModelForStartInspection } from "./get-types-model-for-start-inspection"

/**
 * Audit model to store audit history details
 */
export const GetTypesModel = types.model( {
    GetTypes: types.optional( types.array( GetTypesModelForStartInspection ), [] )
} )

type GetTypesType = Instance<typeof GetTypesModel>
export interface IGetType extends GetTypesType {}
type GetTypesSnapshotType = SnapshotOut<typeof GetTypesModel>
export interface IGetTypesSnapshot extends GetTypesSnapshotType {}

