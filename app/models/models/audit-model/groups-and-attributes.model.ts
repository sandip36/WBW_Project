import { Instance, SnapshotOut, types } from "mobx-state-tree";

export const HazardModel = types.model( {
    ID: types.maybeNull( types.string ),
    Value: types.maybeNull( types.string ),
} )

export const SourceListModel = types.model( {
    ID: types.maybeNull( types.string ),
    Value: types.maybeNull( types.string )
} )
export const AttributesModel = types.model( {
    CustomFormResultID: types.maybeNull( types.string ),
    CustomForm_Attribute_InstanceID: types.maybeNull( types.string ),
    AttributeID: types.maybeNull( types.string ),
    AttributeOrder: types.maybeNull( types.string ), 
    Title: types.maybeNull( types.string ),
    AuditAndInspectionScoreID: types.maybeNull( types.string ),
    ScoreList: types.optional( types.array( HazardModel ), [] ),
    CorrectAnswerID: types.maybeNull( types.string ),
    MaxCorrectAnswerID: types.maybeNull( types.string ),
    CorrectAnswerValue: types.maybeNull( types.string ),
    GivenAnswerID: types.maybeNull( types.string ),
    SourceID: types.maybeNull( types.string ),
    DoNotShowHazard: types.maybeNull( types.string ),
    HazardsID: types.maybeNull( types.string ),
    Comments: types.maybeNull( types.string ),
    IsCommentsMandatory: types.maybeNull( types.string ),
    AuditAndInspectionScore: types.maybeNull( types.string ),
} )
export const GroupsModel = types.model( {
    GroupOrder: types.maybeNull( types.string ),
    GroupID: types.maybeNull( types.string ),
    GroupName: types.maybeNull( types.string ),
    Attributes: types.optional( types.array( AttributesModel ), [] )
} )

export const GroupsAndAttributesModel = types 
    .model( {
        HazardList: types.optional( types.array( HazardModel ), [] ),
        SourceList: types.optional( types.array( SourceListModel ), [] ),
        Groups: types.optional( types.array( GroupsModel ), [] ),
    } )

export type GroupsAndAttributesType = Instance<typeof GroupsAndAttributesModel>
export interface IGroupsAndAttributes extends GroupsAndAttributesType {}
type GroupsAndAttributesSnapshotType = SnapshotOut<typeof GroupsAndAttributesModel>
export interface IGroupsAndAttributesType extends GroupsAndAttributesSnapshotType {}
