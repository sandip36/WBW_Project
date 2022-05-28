import { flow, Instance, types } from "mobx-state-tree"
import { customFormModel, ICustomForm } from "models/models/CustomForm/customFormModel"
import { GeneralResponse } from "services/api"
import { createModelCollection } from '../../factories/model-collection.factory'



export const CustomFormStore = createModelCollection( customFormModel )
    .props( {
    } )
    .views( self => ( {
    
    } ) )
    .actions( self => {

    
        const fetch = flow( function * ( ) {
            try {
                
                const result: GeneralResponse<ICustomForm[]> = yield self.environment.api.fetchData()
                if ( result?.data ) {
                    const dashboards = result.data.map( ( item,index ) => {
                        return { ...item, id:index  }
                    } )
                    //  console.log( "jjjjjj",JSON.stringify( dashboards ) )

                    
                    self._insertOrUpdate( dashboards )
                }
                return result
            } catch( error ) {
                return null
            } 
        } )

        return {
            fetch,
        }
    } )




// export const CustomFormStore = types.model( "customFormModel" )

export type TaskStoreType = Instance<typeof CustomFormStore>
