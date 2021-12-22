import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuditAndInspectionDetailsModel } from "./audit-inspection-detail-model"
import { SystemFieldsOuterModel } from "./system-fields-outer-model"
import { GroupsAndAttributesModel } from "./groups-and-attributes.model"

/**
 * Audit model to store audit history details
 */
export const InspectionModel = types.model( {
    AuditAndInspectionDetails: types.optional( AuditAndInspectionDetailsModel, {} ),
    SystemFields: types.optional( SystemFieldsOuterModel, {} ),
    GroupsAndAttributes: types.optional( GroupsAndAttributesModel, {} ),
} )

type InspectionType = Instance<typeof InspectionModel>
export interface IInspection extends InspectionType {}
type InspectionSnapshotType = SnapshotOut<typeof InspectionModel>
export interface IInspectionSnapshot extends InspectionSnapshotType {}

