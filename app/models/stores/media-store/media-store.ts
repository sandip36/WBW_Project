import { Instance, flow, types, getRoot } from "mobx-state-tree"
import { GeneralResponse, IMediaPayload, IObservationFetchPayload } from "services/api"
import { createModelCollection } from '../../factories/model-collection.factory'
import Toast from "react-native-simple-toast"
import { MediaModel } from "models/models/media-model"
import { AuthStoreType } from "../auth-store"

export const MediaStore = createModelCollection( MediaModel )
    .props( {
        pageNumber: types.optional( types.string, "1" )
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
                    PageNumber: self.pageNumber
                } as IMediaPayload
                const result: GeneralResponse<any> = yield self.environment.api.fetchMedia( payload )
                console.log( 'result is ',JSON.stringify( result ) )
                if ( result?.data ) {
                    //
                }
                return result
            } 
            catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while fetching media data', Toast.LONG, Toast.CENTER )
                return null
            }
        } )
        
        

        return {
            fetch
        }
    } )

export type MediaStoreType = Instance<typeof MediaStore>