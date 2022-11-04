
import { Instance, flow, types, getRoot } from "mobx-state-tree"
import { GeneralResponse, IMediaPayload } from "services/api"
import { createModelCollection } from '../../factories/model-collection.factory'
import Toast from "react-native-simple-toast"
import { AuthStoreType } from "../auth-store"
import { CompanyUserListmodel, UserListByCompanymodel } from "models/models/user-list-by-company-model/user-list-by-comany-model"

export const UserListByCompanyStore = createModelCollection( UserListByCompanymodel )
    .props( {
        // UserListByCompany: types.optional( UserListByCompanymodel ,{} ),

        showModal: types.optional( types.boolean, false ),
        selectedUser: types.optional( CompanyUserListmodel, {} ),
    
    } )
    .views( self => ( {

       
        
    } ) )
    .actions( self => {
        const rootStore = getRoot<{
            AuthStore: AuthStoreType
        }>( self )
        const fetch = flow( function * ( ) {
            try {
                const payload = {
                    UserID: rootStore.AuthStore?.user?.UserID,
                    AccessToken: rootStore.AuthStore?.user?.AccessToken,
                } as IMediaPayload
                const result: GeneralResponse<any> = yield self.environment.api.fetchUserbyCompany( payload )
                if ( result?.data ) {
                    const UserListByCompanytemp = result.data.map( item => {
                        return { ...item, id: item.UserID }
                    } )
                   
                    self._insertOrUpdate( UserListByCompanytemp )
                }
                return result
            } 
            catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while fetchUserbyCompany data', Toast.LONG, Toast.CENTER )
                return null
            }
        } )
       

        const clearStore = flow( function * ( ) {
            self.items.clear()
            self.selectedUser = {} as any
            self.showModal = false 
        } )

        const hideSearchableModal = flow( function * ( ) {
            self.showModal = false
        } )

        const setSelectedUser = flow( function * ( user: any ) {
            self.selectedUser = { ...user }
        } )

        const resetSelectedUser = flow( function * ( ) {
            self.selectedUser = {} as any
        } )

        const displaySearchableModal = flow( function * ( ) {
            self.showModal = true
        } )
       
        return {
            fetch,
            clearStore,
            hideSearchableModal,
            setSelectedUser,
            resetSelectedUser,displaySearchableModal
    
        }
    } )

export type  UserListByCompanyStoreType = Instance<typeof  UserListByCompanyStore>