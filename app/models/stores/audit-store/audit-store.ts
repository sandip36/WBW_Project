import { Instance, flow, types } from "mobx-state-tree"
import { GeneralResponse, IAuditHistoryFetchPayload, IFetchDataForStartInspectionPayload, IFetchEditInspectionDetailsPayload } from "services/api"
import Toast from "react-native-simple-toast"
import { AuditModel, IAudit  } from "models/models/audit-model/audit-model"
import { withEnvironment } from "models/environment"
import { isEmpty, uniqBy } from "lodash"
import { GetTypesModel } from "models/models/audit-model"
import { InspectionModel } from "models/models/audit-model/inspection-model"

export const AuditStoreProps = {
    audit: types.optional( AuditModel, {} ),
    getTypesForStartInspection: types.optional( GetTypesModel, {} ),
    refreshing: types.optional( types.boolean, false ),
    page: types.optional( types.number, 0 ),
    currentInspectionId: types.optional( types.string, "" ),
    inspection: types.optional( InspectionModel, {} )
}

export const AuditStore = types
    .model( AuditStoreProps )
    .extend( withEnvironment )
    .views( self => ( {
        get auditAndInspectionDetails () {
            return isEmpty( self.audit?.AudiAndInspectionListing ) ? [] : self.audit.AudiAndInspectionListing
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
                    self.inspection = result.data
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

        return {
            fetch,
            fetchDataForStartInspection,
            fetchDataForEditInspection,
            setRefreshing,
            reset,
            setCurrentInspectionId
        }
    } )

export type AuditStoreType = Instance<typeof AuditStore>