import { Instance, SnapshotOut, types, flow, getRoot } from "mobx-state-tree"
import { RootStore } from "models"
import { withEnvironment } from "models/environment/with-environment"
import { UserStoreType } from "models/stores"
import { UserModel } from "models/models"
import Toast from "react-native-simple-toast"
import { GeneralResponse, ILoginPayload, ILoginResponse } from "services/api/api.types"

/**
 * Model description here for TypeScript hints.
 */

const AuthStoreProps = {
    token: types.maybe( types.string ),
    user: types.safeReference( UserModel )
}
export const AuthStoreModel = types
    .model( "AuthStore" )
    .extend( withEnvironment )
    .props( AuthStoreProps )
    .volatile( ( ) => ( {
        bootstrapping: true,
        loading: false
    } ) )
    .actions( self => {
        const rootStore = getRoot<{
            UserStore: UserStoreType,
        }>( self )
        const login = flow( function * ( payload: ILoginPayload ) {
            try {
                const result: GeneralResponse<ILoginResponse> = yield self.environment.api.login( payload )
                if ( result?.data ) {
                    self.token = result.data.AccessToken
                    const user = { ...result.data, id: result.data?.UserID }
                    rootStore.UserStore._insertOrUpdate( user )
                    self.environment.api.setToken( self.token )
                    self.user = result.data?.UserID
                }
            }catch( error ) {
                    Toast.showWithGravity( error.message || "error while loggin", Toast.LONG, Toast.CENTER )
                    return null
            }
            
        } )

        const logout = flow( function * () {
            self.token = undefined
            self.user = undefined
            self.environment.api.setToken( null )
            rootStore.resetStore()
        } )

        return {
            login,
            logout,
            afterCreate ( ) {
                self.environment.api.setToken( self.token )
            }
        }
    } )
/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.
 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

export type AuthStoreType = Instance<typeof AuthStoreModel>
export interface IAuthStore extends AuthStoreType {}
type AuthStoreSnapshotType = SnapshotOut<typeof AuthStoreModel>
export interface IAuthStoreSnapshot extends AuthStoreSnapshotType {}
