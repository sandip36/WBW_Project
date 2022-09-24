import { Instance, flow, types, getRoot } from "mobx-state-tree"
import { GeneralResponse, IuserProfilePayload } from "services/api"
import Toast from "react-native-simple-toast"
import { AuthStoreType } from "../auth-store"
import { IImages, IUserProfile, UserProfileModel } from "models/models"
import { withEnvironment } from "models/environment"
import { isEmpty } from "lodash"
import { imageUpload } from "utils/fetch_api"


const UserProfileStoreProps = {
    userData: types.optional( UserProfileModel ,{} ),
}

export const UserProfileStore = types
    .model( "UserProfileModel" )
    .extend( withEnvironment )
    .props( UserProfileStoreProps )
  
    .actions( self => {
        const rootStore = getRoot<{
            AuthStore: AuthStoreType
        }>( self )
      
        const fetch = flow( function * ( payload: IuserProfilePayload ) {
            try {
                console.log( "hello" )
                const result: GeneralResponse<any> = yield self.environment.api.fetchUserProfile( payload )
                if ( result?.data ) {
                    self.userData = result.data

                   
                }
            
                return result
                
            } 
            catch( error ) {
                if( error?.kind === "rejected" || error?.Message === "No Records Found" ) {
                   
                    Toast.showWithGravity( error.message || 'Something went wrong while fetching observations', Toast.LONG, Toast.CENTER )
                    return null
                }
            }
        } )

        const setImages = flow( function * (  image: IImages ) {
            self.userData.images = image
        } )

        function createFormDataForAll ( media ) {
            const data = new FormData()
            const imagesArray = []
            if ( media && media.length > 0 ) {
                media.map( item => {
                    const localUri = item.uri
                    const filename = localUri.split( "/" ).pop()
                    const image = {
                        name: filename,
                        uri: localUri,
                        type: item.mime || item.type || "image/jpeg",
                    }
                    imagesArray.push( image )
                    return media
                } )
                data.append( "file", imagesArray )
            }
        
            return data
        }

        const saveImage = flow( function * ( payload: IImages ) {
            try {
                // const formDataPayload = createFormDataForAll( payload )
                const userId = rootStore.AuthStore.user?.UserID
                // const result: GeneralResponse<any> = yield self.environment.api.uploadUserProfile( formDataPayload, userId )
                // console.log( 'result is ',JSON.stringify( result ) )
                // if ( result?.data && !isEmpty( result.data ) ) {
                //     Toast.showWithGravity( result.data?.Message, Toast.LONG, Toast.CENTER )
                //     return 'success'
                // }else{
                //     return 'fail'
                // }
                const url = `${self.environment.api.apisauce.getBaseURL()}/User/Upload?UserID=${userId}`
                imageUpload( {
                    image: payload,
                    url: url
                } )
                    .then( ( successResponse ) => {
                        console.tron.log( 'response is ',JSON.stringify( successResponse ) )
                        if( isEmpty( successResponse ) ) {
                            return null
                        }
                    } )
                    .catch(error => {
                        console.tron.log( 'error in user profile store ',error )
                    })
            } catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while uploading images', Toast.LONG, Toast.CENTER )
                return null
            }
        } )

        return {
            fetch,
            setImages,
            saveImage
        }
    } )

export type UserProfileStoreType = Instance<typeof UserProfileStore>