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
        },

        sortDashboardByPageOrderArray ( list=[] ) {
            return sortBy( list, [ function ( o ) { return Number( o.HomePageOrder ); } ] );
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
                        const dashboardByCatogory = groupByCategory( dashboards )
                        self._insertOrUpdate( dashboards )
                        return dashboardByCatogory
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
            self.items.clear()
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

const groupByCategory =( list=[] )=>{

    // const cars = [ { make: 'audi', model: 'r8', year: '2012' }, { make: 'audi', model: 'rs5', year: '2013' }, { make: 'ford', model: 'mustang', year: '2012' }, { make: 'ford', model: 'fusion', year: '2015' }, { make: 'kia', model: 'optima', year: '2012' } ];

    let bulletineArray = list.filter( ( data ) => data?.Category ==='Bulletins' )
    bulletineArray= bulletineArray.map( ( data )=>{
        return{
            ...data,order:1
        }
    } )
    let observationArray = list.filter( ( data ) => data?.Category ==='Observation' )
    observationArray= observationArray.map( ( data )=>{
        return{
            ...data,order:2
        }
    } )

    let inspectionArray = list.filter( ( data ) => data?.Category ==='Inspection ' )
    inspectionArray= inspectionArray.map( ( data )=>{
        return{
            ...data,order:3
        }
    } )
    let incidentArray = list.filter( ( data ) => data?.Category ==='Incident Management' )
    incidentArray= incidentArray.map( ( data )=>{
        return{
            ...data,order:5
        }
    } )
    let auditArray = list.filter( ( data ) => data?.Category ==='Audit' )
    auditArray= auditArray.map( ( data )=>{
        return{
            ...data,order:4
        }
    } )
    let myTaskArray = list.filter( ( data ) => data?.Category ==='MyTask' )
    myTaskArray= myTaskArray.map( ( data )=>{
        return{
            ...data,order:6
        }
    } )

    const mergeResult = [].concat( bulletineArray,observationArray, inspectionArray , auditArray, incidentArray,myTaskArray )

    const groups = mergeResult.reduce( ( groups, item ) => ( {
        ...groups,
        [item.Category]: [ ...( groups[item.Category] || [] ), item ]
    } ), {} );
    return groups
}
export type DashboardStoreType = Instance<typeof DashboardStore>