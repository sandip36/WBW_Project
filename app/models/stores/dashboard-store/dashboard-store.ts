import { Instance, flow, getRoot, types } from "mobx-state-tree"
import { DashboardModel, IDashboard } from "models/models/dashboard-model/dashboard-model"
import { GeneralResponse, IDashboardFetchPayload } from "services/api"
import { createModelCollection } from '../../factories/model-collection.factory'
import { AuthStoreType } from "../auth-store/auth-store"
import { sortBy } from "lodash"


export const DashboardStore = createModelCollection( DashboardModel )
    .volatile( ( ) => ( {
        bootstraping: true
    } ) )
    .props( {
        currentDashboardId: types.optional( types.string, '' )
    } )
    .views( self => ( {
        get sortDashboardByPageOrder( ) {
            return sortBy(self.items, [function(o) { return o.HomePageOrder; }]);
        }
    } ) )
    .actions( self => {
        const rootStore = getRoot<{
            AuthStore: AuthStoreType
        }>( self )
        const fetch = flow( function * ( ) {
            self.bootstraping = true
            try {
                const payload = {
                    UserID: rootStore.AuthStore?.user?.UserID,
                    AccessToken: rootStore.AuthStore?.user?.AccessToken
                } as IDashboardFetchPayload
                const result: GeneralResponse<IDashboard[]> = yield self.environment.api.fetchDashboard( payload )
                if ( result?.data ) {
                    const dashboards = result.data.map( item => {
                        return { ...item, id: item.AuditandInspectionTemplateID }
                    } )
                    self._insertOrUpdate( dashboards )
                }
                return result
            } catch( error ) {
                rootStore.AuthStore.logout()
                return null
            } finally {
                self.bootstraping = false
            }
        } )

        const setCurrentDashboardId = flow( function * ( id: string ) {
            self.currentDashboardId = id
        } )

        return {
            fetch,
            setCurrentDashboardId
        }
    } )

export type DashboardStoreType = Instance<typeof DashboardStore>