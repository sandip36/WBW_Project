import { Instance, flow, types } from "mobx-state-tree"
import { EditObservationModel, GetAllfiltersModel, LocationsModel, ObservationModel } from "models/models/observation-model/observation-model"
import { DocumentModel, IDocument, IImages, ImagesModel, IObservation } from "models/models"
import { GeneralResponse, IAllCommanFilterPayload, IEditObervationPayload, IObservationFetchPayload, ISubmitObservation } from "services/api"
import { createModelCollection } from '../../factories/model-collection.factory'
import Toast from "react-native-simple-toast"
import { isEmpty } from "lodash"
import { imageUpload } from "utils/fetch_api/uploadSingleImage"

export const ObservationStore = createModelCollection( ObservationModel )
    .props( {
        refreshing: types.optional( types.boolean, false ),
        page: types.optional( types.number, 0 ),
        startobservation:types.optional( GetAllfiltersModel,{} ),
        showModal: types.optional( types.boolean, false ),
        selectedUser: types.optional( LocationsModel, {} ),
        radioValue: types.optional( types.string, "0" ),
        section: types.optional( types.string, "" ),
        topic: types.optional( types.string, "" ),
        actOrConditions: types.optional( types.string, "" ),
        hazards: types.optional( types.string, "" ),
        showTopic: types.optional( types.boolean, false ),
        isSwitchOn: types.optional( types.boolean, false ),
        UploadImage: types.optional( types.array( ImagesModel ), [] ),
        UploadDocument: types.optional( types.array( DocumentModel ), [] ),
        isComplete: types.optional( types.boolean, false ),
        isImageSelected: types.optional( types.boolean, false ),
        editObservationData:types.optional( EditObservationModel,{} )

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
    
        get currentActOrConditions () {
            return self.actOrConditions && self.startobservation.ActOrConditions.find( item => item.ID === self.actOrConditions )
        },
        get isObservationImagePresent ( ) {
            return self.UploadImage.length > 0
        },
        get isObservationDocumentPresent ( ) {
            return self.UploadDocument.length > 0
        },
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
        get HazardLabel () {
            if( !isEmpty( self.currentActOrConditions ) ){
                return self.currentActOrConditions?.Value.startsWith( "Unsafe" ) ? "Hazard" : "Preventive Hazard"
            }else{
                return "Hazard"
            }
        },
        get observationImage () {
            return self.UploadImage[0]
        }
    } ) )
    .actions( self => {

        const setImages = flow( function * ( payload: IImages  ) {
            self.UploadImage.push( payload )
        } )
        const removeImages = flow( function * ( ) {
            self.UploadImage = [] as any
        } )
        const setDocument= flow( function * ( payload: IDocument  ) {
            self.UploadDocument.push( payload )
        } )
        const removeDocument = flow( function * ( ) {
            self.UploadDocument = [] as any
        } )


        const fetch = flow( function * ( payload: IObservationFetchPayload ) {
            try {
                const result: GeneralResponse<any> = yield self.environment.api.fetchObservations( payload )
                if ( result?.data ) {
                    if( result.data?.Message === "No Records Found" ) {
                        self.isComplete = true
                        self.refreshing = false
                        return null
                    }
                    const observations = result.data.map( item => {
                        return { ...item, id: item.ObservationID }
                    } )
                    self._insertOrUpdate( observations )
                    self.page = Number( payload.PageNumber )
                    self.isComplete = false
                }
                self.refreshing = false
                return result
            } 
            catch( error ) {
                if( error?.kind === "rejected" || error?.Message === "No Records Found" ) {
                    if( self.items?.length > 0 ) {
                        return null
                    }
                    Toast.showWithGravity( error.message || 'Something went wrong while fetching observations', Toast.LONG, Toast.CENTER )
                    return null
                }
            }
        } )

        const saveObservation = flow( function * ( payload: ISubmitObservation ) {
            try {
                const result: GeneralResponse<any> = yield self.environment.api.saveObservation( payload )
                if( isEmpty( result ) || isEmpty( result.data ) ) {
                    return null
                } 
                if ( !isEmpty( result ) && !isEmpty( result.data ) && self.isObservationImagePresent ) {
                    const url = `${self.environment.api.apisauce.getBaseURL()}/Observation/Upload?ObservationID=${ result.data?.ObservationID}`
                    const response = imageUpload( {
                        image: self.UploadImage[0],
                        url: url
                    } )
                    if( isEmpty( response ) ) {
                        return null
                    }
                } 
                if( !isEmpty( result ) && !isEmpty( result.data ) && self.isObservationDocumentPresent ) {
                    const url = `${self.environment.api.apisauce.getBaseURL()}/Observation/Upload?ObservationID=${ result.data?.ObservationID}`
                    const response = imageUpload( {
                        image: self.UploadDocument[0],
                        url: url
                    } )
                    if( isEmpty( response ) ) {
                        return null
                    }
                }


                return "Success"
            } catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while saving observation', Toast.LONG, Toast.CENTER )
                return null
            }
        } )

        const saveAndComeBackObservation = flow( function * ( payload: ISubmitObservation ) {
            try {
                const result: GeneralResponse<any> = yield self.environment.api.saveAndComeBackObservation( payload )
                if( isEmpty( result ) || isEmpty( result.data ) ) {
                    return null
                } 
                if ( !isEmpty( result ) && !isEmpty( result.data ) && self.isObservationImagePresent ) {
                    const url = `${self.environment.api.apisauce.getBaseURL()}/Observation/Upload?ObservationID=${ result.data?.ObservationID}`
                    const response = imageUpload( {
                        image: self.UploadImage[0],
                        url: url
                    } )
                    if( isEmpty( response ) ) {
                        return null
                    }
                } 
                if( !isEmpty( result ) && !isEmpty( result.data ) && self.isObservationDocumentPresent ) {
                    const url = `${self.environment.api.apisauce.getBaseURL()}/Observation/Upload?ObservationID=${ result.data?.ObservationID}`
                    const response = imageUpload( {
                        image: self.UploadDocument[0],
                        url: url
                    } )
                    if( isEmpty( response ) ) {
                        return null
                    }
                }
                return "Success"
            } catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while saving observation', Toast.LONG, Toast.CENTER )
                return null
            }
        } )
        const saveObservationAnonymously = flow( function * ( payload: ISubmitObservation ) {
            try {
                const result: GeneralResponse<any> = yield self.environment.api.saveObservationAnonymously( payload )
                if( isEmpty( result ) || isEmpty( result.data ) ) {
                    return null
                } 
                if ( !isEmpty( result ) && !isEmpty( result.data ) && self.isObservationImagePresent ) {
                    const url = `${self.environment.api.apisauce.getBaseURL()}/Observation/Upload?ObservationID=${ result.data?.ObservationID}`
                    const response = imageUpload( {
                        image: self.UploadImage[0],
                        url: url
                    } )
                    if( isEmpty( response ) ) {
                        return null
                    }
                } 
                if( !isEmpty( result ) && !isEmpty( result.data ) && self.isObservationDocumentPresent ) {
                    const url = `${self.environment.api.apisauce.getBaseURL()}/Observation/Upload?ObservationID=${ result.data?.ObservationID}`
                    const response = imageUpload( {
                        image: self.UploadDocument[0],
                        url: url
                    } )
                    if( isEmpty( response ) ) {
                        return null
                    }
                }
                return "Success"
            } catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while saving observation', Toast.LONG, Toast.CENTER )
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
        // OneditObservation api
        const editObservationApi = flow( function * ( payload: IEditObervationPayload ) {
            try {
                const result: GeneralResponse<IObservation[]> = yield self.environment.api.editObervation( payload )
                if ( result?.data ) {
                    console.log( "data for edit ",result.data )
                    self.editObservationData = result.data as any
                }
                return result
            } catch( error ) {
                Toast.showWithGravity( error.message || 'Something went wrong while edit observations', Toast.LONG, Toast.CENTER )
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
            self.radioValue = '0'
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

        const toggleSwitch = flow( function * ( ) {
            self.isSwitchOn = !self.isSwitchOn
        } )

        const resetSwitch = flow( function * ( ) {
            self.isSwitchOn = false
        } )
        const toggleIsImageSelected = flow( function * ( ) {
            self.isImageSelected = !self.isImageSelected
        } )
        const setTopicList = flow( function * ( sectionId, value: any ) {
            const updatedSectionList = self.startobservation.Sections.map( item => {
                if( item.ID === sectionId ) {
                    return { ...item, Topics: value }
                }else{
                    return item
                }
            } )
            self.startobservation.Sections = updatedSectionList as any
        } )
        const resetEditStore = flow( function * ( ) {
            self.editObservationData = {} as any
        } )

        return {
            fetch,
            setRefreshing,
            saveObservation,
            saveAndComeBackObservation,
            saveObservationAnonymously,
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
            resetTopic,
            setTopicList,
            toggleSwitch,
            setImages,
            removeImages,
            setDocument,
            removeDocument,
            resetSwitch,
            toggleIsImageSelected,
            editObservationApi,
            resetEditStore
        }
    } )

export type ObservationStoreType = Instance<typeof ObservationStore>