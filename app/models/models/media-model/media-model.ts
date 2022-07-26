import { isEmpty } from "lodash"
import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { createModel } from '../../factories/model.factory'


/**
 * Media model to store image and video details
 */
export const MediaModel = createModel( {
    id: types.maybeNull( types.string ),
    Title: types.maybeNull( types.string ),
    Description: types.maybeNull( types.string ),
    VideoPath: types.maybeNull( types.string ),
    ImagePath: types.maybeNull( types.string ),
    PlayVideoOnDelivery: types.maybeNull( types.string ),
    Link1Name: types.maybeNull( types.string ),
    Link1: types.maybeNull( types.string ),
    Link2Name: types.maybeNull( types.string ),
    Link2: types.maybeNull( types.string ),
    CreatedOn: types.maybeNull( types.string ),
    CreatedByName: types.maybeNull( types.string ),
    FirstName: types.maybeNull( types.string ),
    LastName: types.maybeNull( types.string ),
    Message1: types.maybeNull( types.string ),
    Message1IsRead: types.maybeNull( types.string ),
    Message1DateRead: types.maybeNull( types.string ),
    isCompleted: types.optional( types.boolean, false )
} ).views( self => ( {
    get initials ( ) {
        const firstInitial = !isEmpty( self?.FirstName ) ? self.FirstName.charAt( 0 ).toUpperCase() :  ""
        const secondInitial = !isEmpty( self?.LastName ) ? self.LastName.charAt( 0 ).toUpperCase() : ""
        return `${firstInitial}${secondInitial}`
    },
} ) ).actions( self => {
    const setIsCompleted = flow( function * ( ) {
        self.isCompleted = !self.isCompleted
    } )
    const setMessage1IsRead = flow( function * ( id: string ) {
        self.Message1IsRead = id;
    } )

    return {
        setIsCompleted,
        setMessage1IsRead
    }
} )

type MediaType = Instance<typeof MediaModel>
export interface IMedia extends MediaType {}
type MediaSnapshotType = SnapshotOut<typeof MediaModel>
export interface IMediaSnapshot extends MediaSnapshotType {}

