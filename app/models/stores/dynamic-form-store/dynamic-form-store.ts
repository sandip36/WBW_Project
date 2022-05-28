import { Instance, flow } from "mobx-state-tree"
import { DynamicFormModel, IDynamicForm } from "models/models"
import { IDashboard } from "models/models/dashboard-model/dashboard-model"
import { GeneralResponse } from "services/api"
import { createModelCollection } from '../../factories/model-collection.factory'

export const DynamicFormStore = createModelCollection( DynamicFormModel )
    .views( self => ( {
        //
    } ) )
    .actions( self => {
        const fetch = flow( function * ( ) {
            try {
                const result: GeneralResponse<IDynamicForm[]> = yield self.environment.api.fetchDynamicFormData()
                if ( result?.data ) {
                    const dashboards = result.data.map( ( item, index ) => {
                        return { ...item, id: String( index ) }
                    } )
                    self._insertOrUpdate( dashboards )
                }
                return result
            } catch( error ) {
                return null
            }
        } )

        return {
            fetch
        }
    } )

export type DynamicFormStoreType = Instance<typeof DynamicFormStore>