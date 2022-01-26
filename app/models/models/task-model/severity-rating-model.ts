import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { createModel } from '../../factories/model.factory'

/**
 * Task model to store task rating details(Assign Tasks)
 */
export const SeverityRatingModel = createModel( {
    SeverityRate: types.maybe( types.string ),
    SeverityRateValue: types.maybe( types.string ),
} )

type SeverityRatingType = Instance<typeof SeverityRatingModel>
export interface ISeverityRating extends SeverityRatingType {}
type SeverityRatingSnapshotType = SnapshotOut<typeof SeverityRatingModel>
export interface SeverityRatingSnapshot extends SeverityRatingSnapshotType {}
