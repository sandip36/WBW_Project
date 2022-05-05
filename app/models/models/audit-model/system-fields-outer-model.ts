import { flow, getRoot, Instance, SnapshotOut, types } from "mobx-state-tree";
import { AuditStoreType } from "models/stores";


export const SystemFieldsInnerModel = types.model( {
    DisplayOrder: types.maybeNull( types.string ),
    ControlType: types.maybeNull( types.string ),
    ControlLabel: types.maybeNull( types.string ),
    ControlID: types.maybeNull( types.string ),
    IsMandatory: types.maybeNull( types.string ),
    SelectedValue: types.maybeNull( types.string ),
    ControlValues: types.maybeNull( types.string ),  
} )
    .actions( self => {

        const rootStore = getRoot<{
            AuditStore: AuditStoreType,
        }>( self )
        
        const setSelectedValue = flow( function * ( value: string  ) {
            rootStore.AuditStore.setIsWarnMessage( true )
            self.SelectedValue = value
        } )
        
        return {
            setSelectedValue
        }
    } )
type SystemFieldsInnerModelType = Instance<typeof SystemFieldsInnerModel>
export interface ISystemFieldsInnerModel extends SystemFieldsInnerModelType {}
type SystemFieldsInnerModelSnapshotType = SnapshotOut<typeof SystemFieldsInnerModel>
export interface ISystemFieldsInnerModelSnapshot extends SystemFieldsInnerModelSnapshotType {}


export const SystemFieldsOuterModel = types.model( {
    AuditAndInspection_SystemFieldID: types.maybeNull( types.string ),
    SystemFields: types.optional( types.array( SystemFieldsInnerModel ), [] )
} )