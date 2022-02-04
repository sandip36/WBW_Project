import { flow, Instance, SnapshotOut, types } from "mobx-state-tree";

export const HazardModel = types.model( {
    ID: types.maybeNull( types.string ),
    Value: types.maybeNull( types.string ),
} )

export const SourceListModel = types.model( {
    ID: types.maybeNull( types.string ),
    Value: types.maybeNull( types.string )
} )
export const ImagesModel = types.model( {
    height: types.optional( types.number, 0 ),
    width: types.optional( types.number, 0 ),
    types: types.optional( types.string, "" ),
    fileName: types.optional( types.string, "" ),
    fileSize: types.optional( types.number, 0 ),
    uri: types.optional( types.string, "" ),
} )
export type ImagesType = Instance<typeof ImagesModel>
export interface IImages extends ImagesType {}
type ImagesSnapshotType = SnapshotOut<typeof ImagesModel>
export interface IImagesSnapshotType extends ImagesSnapshotType {}

export const AttributesModel = types
    .model( {
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
        Comments: types.optional( types.string, "" ),
        IsCommentsMandatory: types.maybeNull( types.string ),
        AuditAndInspectionScore: types.maybeNull( types.string ),
        auditImage: types.optional( types.array( ImagesModel ), [] )
    } )
    .views( self => ( {
        get currentCommentValue ( ) {
            return self.Comments
        },
        get isAuditImagePresent ( ) {
            return self.auditImage.length > 0
        },
        get checkForNonApplicableValues ( ) {
            const shouldCheckForNonApplicableValues = self.ScoreList.find( item => {
                if( item.Value === "Not Applicable" && item.ID === self.GivenAnswerID ) {
                    return true
                }else{
                    return false
                }
            } )
            return shouldCheckForNonApplicableValues
        },
        get checkForTruthyValues ( ) {
            const checkForTruthyValue = self.ScoreList.find( item => {
                if( [ "True", "False", "Yes", "No","Pass","Fail" ].includes( item.Value ) && item.ID === self.GivenAnswerID ) {
                    return true
                }else{
                    return false
                }
            } )
            return checkForTruthyValue
        },
        checkForParticularValue ( type: string ) {
            const checkForType = self.ScoreList.find( item => {
                if( item.Value === type && item.ID === self.GivenAnswerID ) {
                    return true
                }else{
                    return false
                }
            } )
            return checkForType
        }
    } ) )
    .views( self => ( {
        get currentCommentValue ( ) {
            return self.Comments
        },
        get isAuditImagePresent ( ) {
            return self.auditImage.length > 0
        },
        get commentsMandatoryOrNot ( ) {
            let commentLabel = ''
            switch( self.IsCommentsMandatory ) {
            case 'Mandatory': {
                commentLabel = 'Comments *'
                break;
            }
            case 'Mandatory for Passing Score': {
                if( self.checkForNonApplicableValues ) {
                    commentLabel = 'Comments'
                    break;
                }
                else if( self.checkForTruthyValues ? Number( self.GivenAnswerID ) === Number( self.CorrectAnswerID ) : Number( self.GivenAnswerID ) >= Number( self.CorrectAnswerID ) ) {
                    commentLabel = 'Comments *'
                    break;
                }else{
                    commentLabel = 'Comments'
                    break;
                }
            }
            case 'Mandatory for Failing Score': {
                if( Number( self.GivenAnswerID ) !== 0 && Number( self.GivenAnswerID ) < Number( self.CorrectAnswerID ) ) {
                    commentLabel = 'Comments *'
                    break;
                }else{
                    commentLabel = 'Comments'
                    break;
                }     
            }
            case 'Not Mandatory': {
                commentLabel = 'Comments'
                break;
            }
            case 'Mandatory for N/A': {
                if( self.checkForNonApplicableValues ) {
                    commentLabel = 'Comments *'
                    break;
                }else{
                    commentLabel = 'Comments'
                    break;
                }    
            }
            case 'Mandatory for Passing Score and N/A': {
                if( Number( self.GivenAnswerID ) >= Number( self.CorrectAnswerID ) || self.checkForNonApplicableValues ) {
                    commentLabel = 'Comments *'
                    break;
                }else{
                    commentLabel = 'Comments'
                    break;
                }
            }
            case 'Mandatory for Failing Score and N/A': {
                if( Number( self.GivenAnswerID ) !== 0 && Number( self.GivenAnswerID ) < Number( self.CorrectAnswerID ) || self.checkForNonApplicableValues ) {
                    commentLabel = 'Comments *'
                    break;
                }else{
                    commentLabel = 'Comments'
                    break;
                }
            }
            case 'Mandatory for Yes': {
                if( self.checkForParticularValue( 'Yes' ) ) {
                    commentLabel = 'Comments *'
                    break;
                }else{
                    commentLabel = 'Comments'
                    break;
                }    
            }
            case 'Mandatory for No': {
                if( self.checkForParticularValue( 'No' ) ) {
                    commentLabel = 'Comments *'
                    break;
                }else{
                    commentLabel = 'Comments'
                    break;
                }    
            }
            case 'Mandatory for True': {
                if( self.checkForParticularValue( 'True' ) ) {
                    commentLabel = 'Comments *'
                    break;
                }else{
                    commentLabel = 'Comments'
                    break;
                }    
            }
            case 'Mandatory for False': {
                if( self.checkForParticularValue( 'False' ) ) {
                    commentLabel = 'Comments *'
                    break;
                }else{
                    commentLabel = 'Comments'
                    break;
                }    
            }
            case 'Mandatory for Pass': {
                if( self.checkForParticularValue( 'Pass' ) ) {
                    commentLabel = 'Comments *'
                    break;
                }else{
                    commentLabel = 'Comments'
                    break;
                }    
            }
            case 'Mandatory for Fail': {
                if( self.checkForParticularValue( 'Fail' ) ) {
                    commentLabel = 'Comments *'
                    break;
                }else{
                    commentLabel = 'Comments'
                    break;
                }    
            }
            default: {
                commentLabel = "Comments" 
            }
            }
            return commentLabel
        }
    } ) )
    .actions( self => {
        const setGivenAnswerId = flow( function * ( value: string  ) {
            self.GivenAnswerID = value
        } )
        const setSourceId = flow( function * ( value: string  ) {
            self.SourceID = value
        } )
        const setHazardId = flow( function * ( value: string  ) {
            self.HazardsID = value
        } )
        const setComments = flow( function * ( value: string  ) {
            self.Comments = value
        } )
        const setImages = flow( function * ( payload: IImages  ) {
            self.auditImage.push( payload )
        } )

        return {
            setGivenAnswerId,
            setSourceId,
            setHazardId,
            setComments,
            setImages
        }
    } )

export type AttributesType = Instance<typeof AttributesModel>
export interface IAttributes extends AttributesType {}
type AttributesSnapshotType = SnapshotOut<typeof AttributesModel>
export interface IAttributesSnapshotType extends AttributesSnapshotType {}

export const GroupsModel = types.model( {
    GroupOrder: types.maybeNull( types.string ),
    GroupID: types.optional( types.string, "" ),
    GroupName: types.maybeNull( types.string ),
    Attributes: types.optional( types.array( AttributesModel ), [] )
} )

export type GroupsType = Instance<typeof GroupsModel>
export interface IGroups extends GroupsType {}
type GroupsSnapshotType = SnapshotOut<typeof GroupsModel>
export interface IGroupsSnapshotType extends GroupsSnapshotType {}

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
