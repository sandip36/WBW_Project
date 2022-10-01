import { isEmpty } from "lodash"
import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { createModel } from '../../factories/model.factory'


/**
 * User model to store user details
 */
export const UserProfileModel = createModel( {
    
    UserCode: types.maybeNull( types.string ),
    LevelID: types.maybeNull( types.string ),
    FirstName: types.maybeNull( types.string ),
    LastName: types.maybeNull( types.string ),
    LevelName: types.maybeNull( types.string ),
    LoginName: types.maybeNull( types.string ),
    EmailAddress: types.maybeNull( types.string ),
    DepartmentName: types.maybeNull( types.string ),
    Supervisor: types.maybeNull( types.string ),
    SupervisorID: types.maybeNull( types.string ),
    CompanyName: types.maybeNull( types.string ),
    AreaManager: types.maybeNull( types.string ),
    DepartmentID: types.maybeNull( types.string ),
    Phone: types.maybeNull( types.string ),
    Address: types.maybeNull( types.string ),
    City: types.maybeNull( types.string ),
    State: types.maybeNull( types.string ),
    Zip: types.maybeNull( types.string ),
    Country: types.maybeNull( types.string ),
    eSignaturePath: types.maybeNull( types.string ),
    PhotoPath: types.maybeNull( types.string ),
} )
    .named( 'UserProfileModel' )
    .views( self => ( {
        get initials ( ) {
            const firstInitial = !isEmpty( self?.FirstName ) ? self.FirstName.charAt( 0 ).toUpperCase() :  ""
            const secondInitial = !isEmpty( self?.LastName ) ? self.LastName.charAt( 0 ).toUpperCase() : ""
            return `${firstInitial}${secondInitial}`
        },
        
    } ) )
    .actions( self => {
        const updateFirstName = flow( function * ( firstName:string ) {
            self.FirstName = firstName
        } )
        const updateLastName = flow( function * ( lastName:string ) {
            self.LastName = lastName
        } )

        return {
            updateFirstName,
            updateLastName
            
        }
    } )

type UserProfileType = Instance<typeof UserProfileModel>
export interface IUserProfile extends UserProfileType {}
type UserProfileSnapshotType = SnapshotOut<typeof UserProfileModel>
export interface IUserProfileSnapshot extends UserProfileSnapshotType {}
