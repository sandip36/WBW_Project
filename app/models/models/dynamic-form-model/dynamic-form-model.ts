import { sortBy } from "lodash";
import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
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
    .views( self => ( {
        getDropdownData ( data: any = [], label?: string, value?: string ) {
            return data.map( item => {
                const dropdownRecord = {
                    label: item[label]  || item.Value || label,
                    value: item[value] || item.Id || value
                }
                return dropdownRecord
            } )
        },
    } ) )
    .views( self => ( {
        get dropdownList () {
            const CONTROL_VALUES_LIST = self.ControlValues ?? []
            const returnableDropdownList = self.getDropdownData( CONTROL_VALUES_LIST )
            return returnableDropdownList
        },
    } ) )
    .actions( self => {
        const setSelectedValue = flow( function * ( value: string  ) {
            if( value === null ) {
                self.SelectedValue = ""
            }else{
                self.SelectedValue = value
            }
        } )

        const setSelectedValueForDropdown = flow( function * ( value: number  ) {
            if( value === null ) {
                self.SelectedValue = ""
            }else{
                self.SelectedValue = String( value )
            }
        } )
        
        return {
            setSelectedValue,
            setSelectedValueForDropdown
        }
    } )

type DynamicControlsModelType = Instance<typeof DynamicControlsModel>
export interface IDynamicControlsModel extends DynamicControlsModelType {}
type DynamicControlsModelSnapshotType = SnapshotOut<typeof DynamicControlsModel>
export interface IDynamicControlsModelSnapshot extends DynamicControlsModelSnapshotType {}

/**
 * Dashboard model to store dashboard details
 */
export const DynamicFormModel = createModel( {
    id: types.maybe( types.string ),
    GroupName: types.maybeNull( types.string ),
    DynamicControls: types.optional( types.array( DynamicControlsModel ), [] ),
} )
    .views( self => ( {
        get sortDynamicControlsByDisplayOrder ( ) {
            return sortBy( self.DynamicControls, [ function ( o ) { return Number( o.DisplayOrder ); } ] );
        }
    } ) )

type DynamicFormType = Instance<typeof DynamicFormModel>
export interface IDynamicForm extends DynamicFormType {}
type DynamicFormSnapshotType = SnapshotOut<typeof DynamicFormModel>
export interface IDynamicFormSnapshot extends DynamicFormSnapshotType {}

