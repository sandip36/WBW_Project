import { Instance, flow, types } from "mobx-state-tree"
import { GetAllfiltersModel, LocationsModel, ObservationModel } from "models/models/observation-model/observation-model"
import { IObservation } from "models/models"
import { GeneralResponse, IAllCommanFilterPayload, IObservationFetchPayload } from "services/api"
import { createModelCollection } from '../../factories/model-collection.factory'
import Toast from "react-native-simple-toast"


export const ObservationStore = createModelCollection( ObservationModel )
    .props( {
        refreshing: types.optional( types.boolean, false ),
        page: types.optional( types.number, 0 ),
        startobservation:types.optional( GetAllfiltersModel,{} ),
        showModal: types.optional( types.boolean, false ),
        selectedUser: types.optional( LocationsModel, {} ),
        radioValue: types.optional( types.string, "No" ),
        section: types.optional( types.string, "" ),
        topic: types.optional( types.string, "" ),
        actOrConditions: types.optional( types.string, "" ),
        hazards: types.optional( types.string, "" ),
        showTopic: types.optional( types.boolean, false )
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
        },
        get HazardLabel () {
            return self.actOrConditions && self.actOrConditions.startsWith( "Unsafe" ) ? "Hazard" : "Preventive Hazard"
        }
    } ) )
    .views( self => ( {
        get sectionList ( ) {
            const SECTION_LIST = self.startobservation?.Sections
            const returnableSectionList = self.getDropdownData( SECTION_LIST )
            return returnableSectionList
        },
        get topicList ( ) {
            const SECTION_LIST = self.startobservation?.Sections.find( item => item.ID === self.section )
            const TOPIC_LIST = SECTION_LIST?.Topics
            const returnableTopicList = self.getDropdownData( TOPIC_LIST )
            return returnableTopicList
        },
        get actOrConditionsList ( ) {
            const ACT_OR_CONDITIONS = self.startobservation?.ActOrConditions
            const returnableActOrConditionsList = self.getDropdownData( ACT_OR_CONDITIONS )
            return returnableActOrConditionsList
        },
        get hazardList ( ) {
            const HAZARD_LIST = self.startobservation?.Hazards
            const returnableHazardList = self.getDropdownData( HAZARD_LIST )
            return returnableHazardList
        },
    } ) )
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

        const fetchAllCommanfilter = flow( function * ( payload: IAllCommanFilterPayload ) {
            try {
                const result: GeneralResponse<IObservation[]> = yield self.environment.api.fetchAllCommanfilter( payload )
                if ( result?.data ) {
                    self.startobservation = result.data as any
                }
                return result
            } catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while fetching observations', Toast.LONG, Toast.CENTER )
                return null
            }
        } )

        const displaySearchableModal = flow( function * ( ) {
            self.showModal = true
        } )
        const hideSearchableModal = flow( function * ( ) {
            self.showModal = false
        } )

        const setSelectedUser = flow( function * ( user: any ) {
            self.selectedUser = { ...user }
        } )

        const resetSelectedUser = flow( function * ( ) {
            self.selectedUser = {} as any
        } )

        const setRefreshing = flow( function * ( ) {
            self.refreshing = !self.refreshing
        } )

        const setRadioValue = flow( function * ( value: string ) {
            self.radioValue = value
        } )
        const resetRadioValue = flow( function * ( ) {
            self.radioValue = 'No'
        } )

        const resetTopic = flow( function * ( ) {
            self.topic = ""
        } )
        
        const setDropdown = flow( function * ( label?: string, value?: string ) {
            const currentData = self as any
            currentData[label] = value
        } )

        const resetDropdowns = flow( function * ( ) {
            self.section = ''
            self.topic = ''
            self.actOrConditions = ''
            self.hazards = ''
        } )
        
        const displayShowTopic = flow( function * ( ) {
            self.showTopic = true
        } )

        const hideShowTopic = flow( function * ( ) {
            self.showTopic = false
        } )

        return {
            fetch,
            setRefreshing,
            fetchAllCommanfilter,
            displaySearchableModal,
            hideSearchableModal,
            setSelectedUser,
            resetSelectedUser,
            setRadioValue,
            resetRadioValue,
            setDropdown,
            resetDropdowns,
            displayShowTopic,
            hideShowTopic,
            resetTopic
        }
    } )

export type ObservationStoreType = Instance<typeof ObservationStore>