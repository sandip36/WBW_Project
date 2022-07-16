import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { createModel } from '../../factories/model.factory'


/**
 * Media model to store image and video details
 */
export const MediaModel = createModel( {
    BulletinID: types.maybeNull( types.string ),
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
    LastName: types.maybeNull( types.string )
} )

type MediaType = Instance<typeof MediaModel>
export interface IMedia extends MediaType {}
type MediaSnapshotType = SnapshotOut<typeof MediaModel>
export interface IMediaSnapshot extends MediaSnapshotType {}

