import { Instance, SnapshotOut, types, applySnapshot, flow } from "mobx-state-tree"
import { UserStore } from "models/stores"
import { AuditStore } from "models/stores/audit-store"
import { AuthStoreModel } from "models/stores/auth-store"
import { DashboardStore } from "models/stores/dashboard-store"
import { ObservationStore } from "models/stores/observation-store/observation-store"
import { TaskStore } from "models/stores/task-store"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model( "RootStore" ).props( {
    AuthStore: types.optional( AuthStoreModel, {} ),
    UserStore: types.optional( UserStore, {} ),
    DashboardStore: types.optional( DashboardStore, {} ),
    ObservationStore: types.optional( ObservationStore, {} ),
    AuditStore: types.optional( AuditStore, {} ),
    TaskStore: types.optional( TaskStore, {} )
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
