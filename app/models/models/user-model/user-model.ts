import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { createModel } from '../../factories/model.factory'


/**
 * User model to store user details
 */
export const UserModel = createModel( {
    id: types.maybeNull( types.identifier ),
    UserID: types.maybeNull( types.string ),
    FirstName: types.maybeNull( types.string ),
    LastName: types.maybeNull( types.string ),
    FullName: types.maybeNull( types.string ),
    UserName: types.maybeNull( types.string ),
    EmailAddress: types.maybeNull( types.string ),
    AccessToken: types.maybeNull( types.string ),
    LevelID: types.maybeNull( types.string ),
    CompanyID: types.maybeNull( types.string ),
    CompanyName: types.maybeNull( types.string ),
    LevelName: types.maybeNull( types.string ),
    skipCount: types.optional( types.number, 0 ),
    skippedDate: types.maybe( types.Date )
} )
    .named( 'UserModel' )
    .views( self => ( {
        shouldShowUpdateModal ( ) {
            const currentDate = new Date()
            return self.skippedDate?.toDateString() !== currentDate.toDateString()
        },
    } ) )
    .actions( self => {
        const updateSkipCount = flow( function * ( count = 1 ) {
            self.skipCount += count
        } )

        const setSkippedDate = flow( function * ( ) {
            self.skippedDate = new Date()
        } )

        const resetSkipCount = flow( function * ( ) {
            self.skipCount = 0
        } )

        return {
            updateSkipCount,
            setSkippedDate,
            resetSkipCount
        }
    } )

type UserType = Instance<typeof UserModel>
export interface IUser extends UserType {}
type UserSnapshotType = SnapshotOut<typeof UserModel>
export interface IUserSnapshot extends UserSnapshotType {}

