import { Instance, flow, getRoot, types } from "mobx-state-tree"
import { DashboardModel, IDashboard } from "models/models/dashboard-model/dashboard-model"
import { GeneralResponse, IDashboardFetchPayload } from "services/api"
import { createModelCollection } from '../../factories/model-collection.factory'
import { AuthStoreType } from "../auth-store/auth-store"
import { isEmpty, sortBy } from "lodash"


export const DashboardStore = createModelCollection( DashboardModel )
    .volatile( ( ) => ( {
        bootstraping: true
    } ) )
    .props( {
        currentDashboardId: types.optional( types.string, '' )
    } )
    .views( self => ( {
        get sortDashboardByPageOrder ( ) {
            return sortBy( self.items, [ function ( o ) { return Number( o.HomePageOrder ); } ] );
        }
    } ) )
    .actions( self => {
        const rootStore = getRoot<{
            AuthStore: AuthStoreType
        }>( self )
        const fetch = flow( function * ( ) {
            self.bootstraping = true
            if ( !isEmpty( rootStore.AuthStore?.user?.UserID )|| !isEmpty( rootStore.AuthStore?.user?.UserID ) ) 
            {
            
                try {
                    const payload = {
                        UserID: rootStore.AuthStore?.user?.UserID,
                        AccessToken: rootStore.AuthStore?.user?.AccessToken
                    } as IDashboardFetchPayload

                    const result: GeneralResponse<IDashboard[]> = yield self.environment.api.fetchDashboard( payload )
                    if ( result?.data ) {
                        const dashboards = result.data.map( item => {
                            return { ...item, id: item.HomePageOrder }
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
            }
        } )

        const setCurrentDashboardId = flow( function * ( id: string ) {
            self.currentDashboardId = id
        } )

        const clearStore = flow( function * ( ) {
            self.items  = [] as any
        } )

        return {
            fetch,
            clearStore,
            beforeCreate ( ) {
                self.environment.api.setBaseUrl( rootStore.AuthStore.baseUrl )
            },
            setCurrentDashboardId
        }
    } )

export type DashboardStoreType = Instance<typeof DashboardStore>