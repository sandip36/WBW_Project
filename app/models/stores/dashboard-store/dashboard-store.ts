import { Instance, flow, getRoot } from "mobx-state-tree"
import { DashboardModel, IDashboard } from "models/models/dashboard-model"
import { GeneralResponse, IDashboardFetchPayload } from "services/api"
import { createModelCollection } from '../../factories/model-collection.factory'
import { AuthStoreType } from "../auth-store/auth-store"


export const DashboardStore = createModelCollection( DashboardModel )
    .volatile( ( ) => ( {
        bootstraping: true
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
                    self._insertOrUpdate( result.data )
                }
                return result
            } catch( error ) {
                console.tron.log( 'error', error )
                rootStore.AuthStore.logout()
                return null
            } finally {
                self.bootstraping = false
            }
        } )

        return {
            fetch
        }
    } )

export type DashboardStoreType = Instance<typeof DashboardStore>