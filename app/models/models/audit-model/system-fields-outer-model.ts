import { types } from "mobx-state-tree";


export const SystemFieldsInnerModel = types.model( {
    DisplayOrder: types.maybeNull( types.string ),
    ControlType: types.maybeNull( types.string ),
    ControlLabel: types.maybeNull( types.string ),
    ControlID: types.maybeNull( types.string ),
    IsMandatory: types.maybeNull( types.string ),
    SelectedValue: types.maybeNull( types.string ),
    ControlValues: types.maybeNull( types.string ),
   
} )

export const SystemFieldsOuterModel = types.model( {
    AuditAndInspection_SystemFieldID: types.maybeNull( types.string ),
    SystemFields: types.optional( types.array( SystemFieldsInnerModel ), [] )
} )