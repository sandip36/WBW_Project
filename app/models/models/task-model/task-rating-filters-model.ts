import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { createModel } from '../../factories/model.factory'
import { ProbabilityRatingModel } from "./probability-rating-model"
import { SeverityRatingModel } from "./severity-rating-model"
import { UserListModel } from "./user-list-model"

/**
 * Task model to store task rating details(Assign Tasks)
 */
export const TaskRatingFiltersModel = createModel( {
    SeverityRating: types.optional( types.array( SeverityRatingModel ), [] ),
    ProbabilityRating: types.optional( types.array( ProbabilityRatingModel ), [] ),
    UserList: types.optional( types.array( UserListModel ), [] ),
} )

type TaskRatingFiltersType = Instance<typeof TaskRatingFiltersModel>
export interface ITaskRatingFilters extends TaskRatingFiltersType {}
type TaskRatingFiltersSnapshotType = SnapshotOut<typeof TaskRatingFiltersModel>
export interface ITaskRatingFiltersSnapshot extends TaskRatingFiltersSnapshotType {}


