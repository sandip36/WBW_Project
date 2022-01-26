import { flow, Instance, types } from "mobx-state-tree"
import { TaskModel } from "models/models/task-model/task-model"
import { GeneralResponse, ICompleteTaskPayload, IFetchRiskRatingPayload, IFetchTaskPayload, IFetchTaskRatingDetailsPayload } from "services/api"
import Toast from "react-native-simple-toast"
import {  withEnvironment } from "models"
import { IImages, ImagesModel } from "models/models/audit-model/groups-and-attributes.model"
import { isEmpty } from "lodash"
import { TaskRatingFiltersModel } from "models/models/task-model/task-rating-filters-model"

export const TaskStore = types.model( "TaskModel" )
    .extend( withEnvironment )
    .props( {
        attributeID: types.optional( types.string, "" ),
        customFormResultID: types.optional( types.string, "" ),
        task: types.optional( TaskModel, {} ),
        isTaskPresent: true,
        radioValue: types.optional( types.string, "Complete Task" ),
        currentHazardId: types.optional( types.string, "" ),
        taskImage:  types.optional( ImagesModel, {} ),
        isImagePresent: types.optional( types.boolean, false ),
        completedTaskComments: types.optional( types.string, "" ),
        taskRatingFilters: types.optional( TaskRatingFiltersModel, {} ),
        currentSeverityRating: types.maybeNull( types.string ),
        currentProbabilityRating: types.maybeNull( types.string ),
        currentRatingValue: types.optional( types.string, "" ),
        autoCompleteValue: types.optional( types.string, "" )
    } )
    .views( self => ( {
        getDropdownData ( data: any = [], label?: string, value?: string ) {
            return data.map( item => {
                const dropdownRecord = {
                    label: item[label]  || item.Value || label,
                    value: item[value] || item.ID || value
                }
                return dropdownRecord
            } )
        } 
    } ) )
    .views( self => ( {
        get severityRatingList () {
            const SEVERITY_RATING_LIST = self.taskRatingFilters?.SeverityRating
            const returnableSeverityRatingList = self.getDropdownData( SEVERITY_RATING_LIST, 'SeverityRate', 'SeverityRateValue' )
            return returnableSeverityRatingList
        },
        get probabilityRatingList () {
            const PROBABILITY_RATING_LIST = self.taskRatingFilters?.ProbabilityRating
            const returnableProbabilityRatingList = self.getDropdownData( PROBABILITY_RATING_LIST, 'ProbabilityRate', 'ProbabilityRateValue' )
            return returnableProbabilityRatingList
        },
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

        const fetchTaskRatingDetails = flow( function * ( payload: IFetchTaskRatingDetailsPayload ) {
            try {
                const result: GeneralResponse<any> = yield self.environment.api.fetchTaskRatingFilters( payload )
                if( result && result.data ) {
                    self.taskRatingFilters = result.data
                }
                return result
            } catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while fetching tasks rating details', Toast.LONG, Toast.CENTER )
                return null
            }
        } )

        const fetchRiskRating = flow( function * ( payload: IFetchRiskRatingPayload ) {
            try {
                const result: GeneralResponse<any> = yield self.environment.api.fetchRiskRating( payload )
                if( result && result?.data ) {
                    self.currentRatingValue = result.data?.RiskRating
                }
                return result
            } catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while fetching tasks rating details', Toast.LONG, Toast.CENTER )
                return null
            }
        } )

        const completeTask = flow( function * ( payload: ICompleteTaskPayload ) {
            try {
                const result: GeneralResponse<any> = yield self.environment.api.completeTask( payload )
                if( isEmpty( result ) || isEmpty( result.data ) ) {
                    return null
                }else if ( !isEmpty( result ) && !isEmpty( result.data ) ) {
                    self.completedTaskComments = result.data?.Comments
                    Toast.showWithGravity( 'Task Completed Successfully', Toast.LONG, Toast.CENTER );
                    return 'success'
                }else{
                    return null
                }       
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
        const setCurrentHazardId = flow( function * ( id: string ) {
            self.currentHazardId = id
        } )
        const setRadioValue = flow( function * ( value: string ) {
            self.radioValue = value
        } )
        const resetRadioValue = flow( function * ( ) {
            self.radioValue = 'Complete Task'
        } )
        const setImages = flow( function * ( image: IImages ) {
            self.taskImage = image
            self.isImagePresent = true
        } )
        const setCurrentSeverityRatingValue = flow( function * ( value: string ) {
            self.currentSeverityRating = value
        } )
        const setCurrentProbabilityRatingValue = flow( function * ( value: string ) {
            self.currentProbabilityRating = value
        } )
        const resetCurrentSeverityRatingValue = flow( function * ( ) {
            self.currentSeverityRating = ""
        } )
        const resetCurrentProbabilityRatingValue = flow( function * ( ) {
            self.currentProbabilityRating = ""
        } )
        return {
            fetch,
            fetchTaskRatingDetails,
            fetchRiskRating,
            completeTask,
            setAttributeID,
            setCustomFormResultID,
            setRadioValue,
            resetRadioValue,
            setCurrentHazardId,
            setImages,
            setCurrentSeverityRatingValue,
            setCurrentProbabilityRatingValue,
            resetCurrentSeverityRatingValue,
            resetCurrentProbabilityRatingValue
        }
    } )

export type TaskStoreType = Instance<typeof TaskStore>