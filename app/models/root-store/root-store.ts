import { Instance, SnapshotOut, types, applySnapshot, flow } from "mobx-state-tree"
import { UserStore } from "models/stores"
import { AuthStoreModel } from "models/stores/auth-store"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model( "RootStore" ).props( {
    AuthStore: types.optional( AuthStoreModel, {} ),
    UserStore: types.optional( UserStore, {} ),
} ).actions( self => {
    const resetStore = flow( function * () {
        applySnapshot( self, {} )
    } )

    return {
        resetStore,
    }
} )

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
