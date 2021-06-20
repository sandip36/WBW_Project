import { Instance, flow, types } from "mobx-state-tree"
import { ObservationModel } from "models/models/observation-model/observation-model"
import { IObservation } from "models/models"
import { GeneralResponse, IObservationFetchPayload } from "services/api"
import { createModelCollection } from '../../factories/model-collection.factory'
import Toast from "react-native-simple-toast"



export const ObservationStore = createModelCollection( ObservationModel )
    .props( {
        refreshing: types.optional( types.boolean, false ),
        page: types.optional( types.number, 0 )
    } )
    .actions( self => {
        const fetch = flow( function * ( payload: IObservationFetchPayload ) {
            try {
                const result: GeneralResponse<IObservation[]> = yield self.environment.api.fetchObservations( payload )
                if ( result?.data ) {
                    const observations = result.data.map( item => {
                        return { ...item, id: item.ObservationID }
                    } )
                    self._insertOrUpdate( observations )
                    self.page = Number( payload.PageNumber )
                }
                return result
            } catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while fetching observations', Toast.LONG, Toast.CENTER )
                return null
            }
        } )

        const setRefreshing = flow( function * ( ) {
            self.refreshing = !self.refreshing
        } )

        return {
            fetch,
            setRefreshing
        }
    } )

export type ObservationStoreType = Instance<typeof ObservationStore>