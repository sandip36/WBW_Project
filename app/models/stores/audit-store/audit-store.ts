import { Instance, flow, types } from "mobx-state-tree"
import { GeneralResponse, IAuditHistoryFetchPayload } from "services/api"
import Toast from "react-native-simple-toast"
import { AuditModel, IAudit } from "models/models/audit-model/audit-model"
import { withEnvironment } from "models/environment"
import { isEmpty } from "lodash"

export const AuditStoreProps = {
    audit: types.optional( AuditModel, {} ),
    refreshing: types.optional( types.boolean, false ),
    page: types.optional( types.number, 0 ),
    shouldFetch: types.optional( types.boolean, true )
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
                self.shouldFetch = true
                const result: GeneralResponse<IAudit> = yield self.environment.api.fetchAuditHistory( payload )
                if ( result?.data && !isEmpty( result.data?.AudiAndInspectionListing ) ) {
                    self.audit = result.data
                    self.refreshing = false
                    self.page = Number( payload.PageNumber )
                }else{
                    self.refreshing = false
                    self.shouldFetch = false
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

        return {
            fetch,
            setRefreshing,
            reset
        }
    } )

export type AuditStoreType = Instance<typeof AuditStore>