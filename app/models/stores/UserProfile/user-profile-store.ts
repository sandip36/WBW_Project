import { Instance, flow, types, getRoot } from "mobx-state-tree"
import { GeneralResponse, IuserProfilePayload } from "services/api"
import Toast from "react-native-simple-toast"
import { AuthStoreType } from "../auth-store"
import { IUserProfile, UserProfileModel } from "models/models"
import { withEnvironment } from "models/environment"


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
        

       
       
        
        return {
            fetch,
        }
    } )

export type UserProfileStoreType = Instance<typeof UserProfileStore>