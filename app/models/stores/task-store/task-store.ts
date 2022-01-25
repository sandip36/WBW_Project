import { flow, Instance, types } from "mobx-state-tree"
import { ITask, TaskModel } from "models/models/task-model/task-model"
import { GeneralResponse, IFetchTaskPayload } from "services/api"
import Toast from "react-native-simple-toast"
import { withEnvironment } from "models"


export const TaskStore = types.model( "TaskModel" )
    .extend( withEnvironment )
    .props( {
        attributeID: types.optional( types.string, "" ),
        customFormResultID: types.optional( types.string, "" ),
        task: types.optional( TaskModel, {} ),
        isTaskPresent: true,
        radioValue: types.optional( types.string, "Complete Task" )
    } )
    .views( self => ( {
        //
    } ) )
    .actions( self => {
        const fetch = flow( function * ( payload: IFetchTaskPayload ) {
            try {
                const result: GeneralResponse<any> = yield self.environment.api.fetchTasks( payload )
                if( result && result.data?.Message === "No Task Found" ) {
                    self.isTaskPresent = false
                }else if( result && result?.data ){
                    self.isTaskPresent = true
                    self.task = result.data
                }
                return result
            } catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while fetching tasks', Toast.LONG, Toast.CENTER )
                return null
            }
        } )

        const setAttributeID = flow( function * ( id: string ) {
            self.attributeID = id
        } )
        const setCustomFormResultID = flow( function * ( id: string ) {
            self.customFormResultID = id
        } )
        const setRadioValue = flow( function * ( value: string ) {
            self.radioValue = value
        } )
        const resetRadioValue = flow( function * ( ) {
            self.radioValue = 'Complete Task'
        } )
        return {
            fetch,
            setAttributeID,
            setCustomFormResultID,
            setRadioValue,
            resetRadioValue
        }
    } )

export type TaskStoreType = Instance<typeof TaskStore>