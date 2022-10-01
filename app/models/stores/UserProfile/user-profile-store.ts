import { Instance, flow, types, getRoot } from "mobx-state-tree"
import { GeneralResponse, IuserProfilePayload, IuserProfileSavaPayload } from "services/api"
import Toast from "react-native-simple-toast"
import { AuthStoreType } from "../auth-store"
import { IImages } from "models/models"
import { withEnvironment } from "models/environment"
import { isEmpty } from "lodash"
import { imageUpload } from "utils/fetch_api"
import { UserProfileModel } from "models/models/user-profile-model"


const UserProfileStoreProps = {
    userData: types.optional( UserProfileModel ,{} ),
    imagereset :types.maybeNull( types.string ),
}

export const UserProfileStore = types
    .model( "UserProfileModel" )
    .extend( withEnvironment )
    .props( UserProfileStoreProps )
    .views( self => ( {
    
    } ) )
    .views( self => ( {
       
       
    } ) )
    .actions( self => {
        const rootStore = getRoot<{
            AuthStore: AuthStoreType
        }>( self )
      
        const fetch = flow( function * ( payload: IuserProfilePayload ) {
            try {
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
        const setphotoPath = flow( function * (  PhotoPath: string ) {
            self.userData.PhotoPath = PhotoPath
        } )
        const clearPath = flow( function * ( ) {
            self.imagereset = ""
        } )
        const clearStore = flow( function * ( ) {
            self.userData = {} as any
        } )
        const setFirstName = flow( function * ( value: string  ) {
            self.userData.FirstName = value
        } )
    
        const setLastName = flow( function * ( value: string  ) {
            self.userData.LastName = value
        } )

        const setEmailAddress = flow( function * ( value: string  ) {
            self.userData.EmailAddress = value
        } )

        const setPhone = flow( function * ( value: string  ) {
            self.userData.Phone = value
        } )

        const setAddress = flow( function * ( value: string  ) {
            self.userData.Address = value
        } )

        const setCity = flow( function * ( value: string  ) {
            self.userData.City = value
        } )


        const setState = flow( function * ( value: string  ) {
            self.userData.State = value
        } )

        const setZip = flow( function * ( value: string  ) {
            self.userData.Zip = value
        } )
        const setZCountry = flow( function * ( value: string  ) {
            self.userData.Country = value
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

        const SaveUserProfile = flow( function * ( payload: IuserProfileSavaPayload ) {
            try {
                const result: GeneralResponse<any> = yield self.environment.api.SaveUserProfile( payload )
                if ( result?.data && !isEmpty( result.data ) ) {
                    Toast.showWithGravity( result.data?.Message, Toast.LONG, Toast.CENTER )
                    return 'success'
                }else{
                    return 'fail'
                }
            } catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while save profile', Toast.LONG, Toast.CENTER )
                return null
            }
        } )
  


        const saveImage = flow( function * ( payload: IImages ) {
            try {
                const userId = rootStore.AuthStore.user?.UserID
              
                self.imagereset = "reset"
                self.userData.PhotoPath=""
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
                        const parsedJson = JSON.parse( successResponse )
                        self.userData.PhotoPath = parsedJson.PhotoPath
                    } )
                    .catch( error => {
                        console.tron.log( 'error in user profile store ',error )
                    } )
            } catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while uploading images', Toast.LONG, Toast.CENTER )
                return null
            }
        } )

        return {
            fetch,
            SaveUserProfile,
            setImages,
            saveImage,
            setphotoPath,
            clearStore,
            clearPath,setFirstName,setZCountry,setZip,setState,setCity,setAddress,setPhone,setEmailAddress,setLastName,

        }
    } )

export type UserProfileStoreType = Instance<typeof UserProfileStore>