import { Instance, flow, types } from "mobx-state-tree"
import { GeneralResponse, IAuditHistoryFetchPayload, IFetchDataForStartInspectionPayload, IFetchEditInspectionDetailsPayload } from "services/api"
import Toast from "react-native-simple-toast"
import { AuditModel, IAudit  } from "models/models/audit-model/audit-model"
import { withEnvironment } from "models/environment"
import { isEmpty, uniqBy, sortBy } from "lodash"
import { GetTypesModel, IAttributes, IGroups } from "models/models/audit-model"
import { InspectionModel } from "models/models/audit-model/inspection-model"

export const AuditStoreProps = {
    audit: types.optional( AuditModel, {} ),
    getTypesForStartInspection: types.optional( GetTypesModel, {} ),
    refreshing: types.optional( types.boolean, false ),
    page: types.optional( types.number, 0 ),
    currentInspectionId: types.optional( types.string, "" ),
    inspection: types.optional( InspectionModel, {} ),
    isPassingValuesSelected: types.optional( types.boolean, false )
}

export const AuditStore = types
    .model( AuditStoreProps )
    .extend( withEnvironment )
    .views( self => ( {
        get auditAndInspectionDetails () {
            return isEmpty( self.audit?.AudiAndInspectionListing ) ? [] : self.audit.AudiAndInspectionListing
        },
        get systemFieldsData () {
            return isEmpty( self.inspection?.SystemFields?.SystemFields ) ? [] : sortBy( self.inspection?.SystemFields?.SystemFields, "DisplayOrder" )
        },
        get dynamicFieldsData () {
            return isEmpty( self.inspection?.GroupsAndAttributes?.Groups ) ? [] : sortBy( self.inspection?.GroupsAndAttributes?.Groups, "GroupOrder" )
        },
        get shouldDisplayWarningMessage () {
            return !!( self.inspection?.AuditAndInspectionDetails?.IsSchedulerRequired === "True" && isEmpty( self.inspection?.AuditAndInspectionDetails?.ReportingPeriodDueDates ) )
        },
        groupsAndAttributesData ( groupId: string ) {
            const groupsAndAttributeData = isEmpty( self.inspection?.GroupsAndAttributes?.Groups ) ? [] : self.inspection?.GroupsAndAttributes?.Groups.filter( item => item.GroupID === groupId ) as IGroups[]
            const attributeData = groupsAndAttributeData[0].Attributes
            return sortBy( attributeData, "AttributeOrder" ) as IAttributes[]
        },
        getDropdownData ( data: any = [], label?: string, value?: string ) {
            return data.map( item => {
                const dropdownRecord = {
                    label: item[label]  || item.Value || label,
                    value: item[value] || item.ID || value
                }
                return dropdownRecord
            } )
        } 
    } ) )
    .views( self => ( {
        get shouldShowReportingPeriod () {
            return self.shouldDisplayWarningMessage 
                ? false 
                : self.inspection.AuditAndInspectionDetails?.IsSchedulerRequired === "True"
        },
        get sourceList () {
            const SOURCE_LIST = self.inspection.GroupsAndAttributes?.SourceList
            const returnableSourceList = self.getDropdownData( SOURCE_LIST )
            return returnableSourceList
        },
        get hazardList () {
            const HAZARD_LIST = self.inspection.GroupsAndAttributes?.HazardList
            const returnableHazardList = self.getDropdownData( HAZARD_LIST )
            return returnableHazardList
        },
        get primaryUser () {
            const PRIMARY_USER_LIST = self.inspection.AuditAndInspectionDetails?.PrimaryUserList
            const returnablePrimaryUserList = self.getDropdownData( PRIMARY_USER_LIST, 'Name' )
            return returnablePrimaryUserList
        },
        get reportingPeriodDueDates () {
            const REPORTING_PERIOD_DUE_DATES = self.inspection.AuditAndInspectionDetails?.ReportingPeriodDueDates
            const returnableReportingPeriodDueDate = self.getDropdownData( REPORTING_PERIOD_DUE_DATES )
            return returnableReportingPeriodDueDate
        },
        get actualReportingPeriodDueDate () {
            const selectedValue = self.inspection.AuditAndInspectionDetails.ReportingPeriodDueDateSelected
            const selectedDueDate = self.inspection.AuditAndInspectionDetails.ReportingPeriodDueDates.find( item => item.Value === selectedValue )
            return selectedDueDate?.Value
        }    
    } ) )
    .actions( self => {
        const fetch = flow( function * ( payload: IAuditHistoryFetchPayload ) {
            try {
                const result: GeneralResponse<IAudit> = yield self.environment.api.fetchAuditHistory( payload )
                if ( result?.data && !isEmpty( result.data?.AudiAndInspectionListing ) ) {
                    self.audit.TemplateDetails = result.data.TemplateDetails
                    const list = uniqBy( [ ...self.audit.AudiAndInspectionListing, ...result.data.AudiAndInspectionListing ], 'AuditAndInspectionID' ) as any
                    self.audit.AudiAndInspectionListing = list as any
                    self.refreshing = false
                    self.page = Number( payload.PageNumber )
                }else{
                    self.refreshing = false
                }
                return result
            } catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while fetching observations', Toast.LONG, Toast.CENTER )
                return null
            }
        } )

        const fetchDataForStartInspection = flow( function * ( payload: IFetchDataForStartInspectionPayload ) {
            try {
                const result: GeneralResponse<any> = yield self.environment.api.fetchDataForStartInspection( payload )
                if ( result?.data && !isEmpty( result.data ) ) {
                    self.getTypesForStartInspection = {
                        GetTypes: result.data
                    }
                    self.refreshing = false
                }else{
                    self.refreshing = false
                }
                return result
            } catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while fetching observations', Toast.LONG, Toast.CENTER )
                return null
            }
        } )
        
        const fetchDataForEditInspection = flow( function * ( payload: IFetchEditInspectionDetailsPayload ) {
            try {
                const result: GeneralResponse<any> = yield self.environment.api.fetchDataForEditInspection( payload )
                if ( result?.data && !isEmpty( result.data ) ) {
                    const handledEdgeCasesResult = isEmpty( result.data?.GroupsAndAttributes?.SourceList ) ? result.data.GroupsAndAttributes.SourceList = [] : result.data?.GroupsAndAttributes?.SourceList
                    self.inspection = { ...handledEdgeCasesResult, ...result.data }
                    self.refreshing = false
                }else{
                    self.refreshing = false
                }
                return result
            } catch( error ) {
                console.tron.log( 'error is ',error.message )
                Toast.showWithGravity( error.message || 'Something went wrong while fetching observations', Toast.LONG, Toast.CENTER )
                return null
            }
        } )

        const setRefreshing = flow( function * ( ) {
            self.refreshing = !self.refreshing
        } )

        const reset = flow( function * ( ) {
            self.audit = undefined
            self.page = 0
            self.refreshing = false
        } )

        const setCurrentInspectionId = flow( function * ( id: string ) {
            self.currentInspectionId = id
        } )

        const setInspectionNotes = flow( function * ( value: string ) {
            self.inspection.AuditAndInspectionDetails.Notes = value
        } )

        const setPrimaryUserId = flow( function * ( id: string ) {
            self.inspection.AuditAndInspectionDetails.PrimaryUserID = id
        } )

        const setReportingPeriodDueDateValue = flow( function * ( value: string ) {
            self.inspection.AuditAndInspectionDetails.ReportingPeriodDueDateSelected = value
        } )

        const togglePassingValueSelected = flow( function * ( ) {
            self.isPassingValuesSelected = !self.isPassingValuesSelected
        } )

        const resetPassingValueSelected = flow( function * ( ) {
            self.isPassingValuesSelected = false
        } )


        return {
            fetch,
            fetchDataForStartInspection,
            fetchDataForEditInspection,
            setRefreshing,
            reset,
            setCurrentInspectionId,
            setInspectionNotes,
            setPrimaryUserId,
            setReportingPeriodDueDateValue,
            togglePassingValueSelected,
            resetPassingValueSelected
        }
    } )

export type AuditStoreType = Instance<typeof AuditStore>