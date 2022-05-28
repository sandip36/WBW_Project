import { createModel } from 'models/factories'
import { Instance, SnapshotOut, types } from "mobx-state-tree"



export const ControlValuesModel = types.model( {
    Id: types.maybeNull( types.string ),
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


export const  customFormModel = createModel( {
    id: types.maybe( types.identifier ),
    GroupName: types.maybeNull( types.string ),
    DynamicControls: types.optional( types.array( DynamicControlsModel ), [] ),


} )

export type CustomFormType = Instance<typeof customFormModel>
export interface ICustomForm extends CustomFormType {}
type CustomFormSnapshotType = SnapshotOut<typeof customFormModel>
export interface ICustomFormType extends CustomFormSnapshotType {}



