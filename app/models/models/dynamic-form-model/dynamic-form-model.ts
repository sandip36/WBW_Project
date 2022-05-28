import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { createModel } from '../../factories/model.factory'


export const ControlValuesModel = types.model( {
    Id: types.maybeNull( types.number ),
    Value: types.maybeNull( types.string )
} )


export const DynamicControlsModel = types.model( {
    DisplayOrder: types.maybeNull( types.number ),
    ControlId:types.maybeNull( types.string ),
    ControlType:types.maybeNull( types.string ),
    ControlLabel:types.maybeNull( types.string ),
    DefaultValue:  types.maybeNull( types.string ),
    SelectedValue: types.maybeNull( types.string ),
    ControlValues: types.optional( types.array( ControlValuesModel ), [] ),
} )

/**
 * Dashboard model to store dashboard details
 */
export const DynamicFormModel = createModel( {
    id: types.maybe( types.string ),
    GroupName: types.maybeNull( types.string ),
    DynamicControls: types.optional( types.array( DynamicControlsModel ), [] ),
} )

type DynamicFormType = Instance<typeof DynamicFormModel>
export interface IDynamicForm extends DynamicFormType {}
type DynamicFormSnapshotType = SnapshotOut<typeof DynamicFormModel>
export interface IDynamicFormSnapshot extends DynamicFormSnapshotType {}

