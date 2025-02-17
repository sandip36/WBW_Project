import { Instance, flow, types, getRoot } from "mobx-state-tree"
import { GeneralResponse, IMediaDeliverdPayload, IMediaPayload } from "services/api"
import { createModelCollection } from '../../factories/model-collection.factory'
import Toast from "react-native-simple-toast"
import { MediaModel } from "models/models/media-model"
import { AuthStoreType } from "../auth-store"

export const MediaStore = createModelCollection( MediaModel )
    .props( {
        pageNumber: types.optional( types.string, "1" ),
        searchTextTemp:types.optional( types.string,"" )


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
                    PageNumber: self.pageNumber,
                    SearchText: self.searchTextTemp
                } as IMediaPayload
                const result: GeneralResponse<any> = yield self.environment.api.fetchMedia( payload )
                if ( result?.data ) {
                    const mediaList = result.data.map( item => {
                        return { ...item, id: item.BulletinID }
                    } )
                    self._insertOrUpdate( mediaList )
                }
                return result
            } 
            catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while fetching media data', Toast.LONG, Toast.CENTER )
                return null
            }
        } )

        const fetchNextMedia = flow( function * ( ) {
            try {
                const payload = {
                    UserID: rootStore.AuthStore?.user?.UserID,
                    AccessToken: rootStore.AuthStore?.user?.AccessToken,
                    PageNumber: String( ( Number( self.pageNumber ) + 1 ) ),
                    SearchText: self.searchTextTemp

                } as IMediaPayload
                const result: GeneralResponse<any> = yield self.environment.api.fetchMedia( payload )
                if ( result?.data ) {
                    const mediaList = result.data.map( item => {
                        return { ...item, id: item.BulletinID }
                    } )
                    self._insertOrUpdate( mediaList )
                }
                return result
            } 
            catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while fetching media data', Toast.LONG, Toast.CENTER )
                return null
            }
        } )
        const readMessageFlag = flow( function * ( BulletinID: string ) {
            try {

                const payload = {
                    UserID: rootStore.AuthStore?.user?.UserID,
                    AccessToken: rootStore.AuthStore?.user?.AccessToken,
                    BulletinID: BulletinID
                } as IMediaDeliverdPayload

                const result: GeneralResponse<any> = yield self.environment.api.Delivered( payload )
                if( result && result.data?.Message === "File Deleted" ) {
                    Toast.showWithGravity( "File Deleted", Toast.LONG, Toast.CENTER );
                    return 'success'
                }else{
                    return null
                }
                
            } catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while deleting tasks', Toast.LONG, Toast.CENTER )
                return null
            }
        } )

        const clearStore = flow( function * ( ) {
            self.items.clear()
            self.pageNumber= "1"
        } )

        const setSearchTextTemp = flow( function * ( value: string ) {
          
            self.searchTextTemp = value
        } )

     
        return {
            fetch,
            fetchNextMedia,
            readMessageFlag,
            clearStore,
            setSearchTextTemp
        }
    } )

export type MediaStoreType = Instance<typeof MediaStore>