import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuditAndInspectionListingModel } from "./audit-inspection-listing-model"
import { TemplateDetailsModel } from "./template-details-model"

/**
 * Audit model to store audit history details
 */
export const AuditModel = types.model( {
    TemplateDetails: types.optional( TemplateDetailsModel, {} ),
    AudiAndInspectionListing: types.optional( types.array( AuditAndInspectionListingModel ), [] )
} )

type AuditType = Instance<typeof AuditModel>
export interface IAudit extends AuditType {}
type AuditSnapshotType = SnapshotOut<typeof AuditModel>
export interface IAuditSnapshot extends AuditSnapshotType {}

