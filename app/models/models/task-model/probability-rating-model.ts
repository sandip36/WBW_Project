import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { createModel } from '../../factories/model.factory'

/**
 * Task model to store task rating details(Assign Tasks)
 */
export const ProbabilityRatingModel = createModel( {
    ProbabilityRate: types.maybe( types.string ),
    ProbabilityRateValue: types.maybe( types.string ),
} )

type ProbabilityRatingType = Instance<typeof ProbabilityRatingModel>
export interface IProbabilityRating extends ProbabilityRatingType {}
type ProbabilityRatingSnapshotType = SnapshotOut<typeof ProbabilityRatingModel>
export interface ProbabilityRatingSnapshot extends ProbabilityRatingSnapshotType {}
