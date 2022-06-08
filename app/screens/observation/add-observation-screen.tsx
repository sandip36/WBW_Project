import { FormHeader } from "components/core/header/form-header"
import React, { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, FlatList, Image, ImageStyle, Modal, StyleProp, Switch, ViewStyle,Platform } from "react-native"
import { Box, Button, CustomDateTimePicker, Input, Radio, ScrollBox, SearchableList, Text, TextAreaInput, TouchableBox } from "components"
import { StackActions, useFocusEffect, useNavigation, useScrollToTop } from "@react-navigation/native"
import { IAllCommanFilterPayload, ISubmitObservation } from "services/api"
import { makeStyles, theme } from "theme"
import { IDocument, ILocationsModel, useStores } from "models"
import { Avatar, Icon, ListItem } from "react-native-elements"
import {  observer } from "mobx-react-lite"
import { useFormik } from "formik"
import { object, string } from "yup"
import { isEmpty, } from "lodash"
import { Dropdown } from "components/core/dropdown/custom-dropdown-component"
import Toast from 'react-native-simple-toast';
import DocumentPicker from 'react-native-document-picker';
import ImageViewer from "react-native-image-zoom-viewer"
import { RenderImage } from "components/inspection"
import { useKeyboard } from "@react-native-community/hooks"





export type AddObservationScreenProps = {

}

export type AddObservationStyleProps = {
    containerStyle: StyleProp<ViewStyle>,
    listItemContainerStyle: StyleProp<ViewStyle>,
    iconContainerStyle: StyleProp<ViewStyle>,
    searchBarContainerStyle: StyleProp<ViewStyle>,
    imageStyle:StyleProp<ImageStyle>
    modalContainerStyle:StyleProp<ViewStyle>
    avatarContainerStyle:StyleProp<ViewStyle>
    keyboardStyle:StyleProp<ViewStyle>
    
}

const useStyles = makeStyles<AddObservationStyleProps>( ( theme ) => ( {
    containerStyle: {
        flex: 1
    },
    listItemContainerStyle: {
        flex: 0.1
    },
    iconContainerStyle: {
        backgroundColor: theme.colors.primary
    },
    searchBarContainerStyle: {
        backgroundColor: theme.colors.primary,
        margin: 0,
        padding: 10,
        borderBottomColor: theme.colors.transparent,
        borderTopColor: theme.colors.transparent
    },
    imageStyle: {
        width: 100,
        height: 100,
        borderRadius: theme.borderRadii.medium,
        flexDirection: 'row',
        alignItems: 'center'
    },
    modalContainerStyle: {
        flex: 1
    },  avatarContainerStyle: {
        backgroundColor: theme.colors.primary
    },
    keyboardStyle:{
        height: Platform.OS === 'ios' ? '30%' : '2%' 
    }
    // {{ height: Platform.OS === 'ios' ? '30%' : '3%' }
    
} ) )

const RADIO_LIST = [
    { label: 'No', value: "0" },
    { label: 'Yes', value: "1" }
]

export type RightSwitchProps = {
    isEnabled?: boolean,
    toggleSwitch?: ( value ) => any
}

export type LabelWithAsteriskProps = {
    label?: string
}

export const RightSwitch: React.FunctionComponent<RightSwitchProps> = ( props ) => {
    const {
        isEnabled,
        toggleSwitch
    } = props
    return (
        <Box alignItems={"center"} flexDirection="row">
            <Icon name= 'incognito' type='material-community' color='white'/>
            <Box mx="medium">
                <Switch
                    trackColor={{ false: "gray", true: "white" }}
                    thumbColor={isEnabled ? "#68c151" : "white"}
                    ios_backgroundColor='lightgray'
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </Box>
        </Box>
    )
}

export const LabelWithAsterisk: React.FunctionComponent<LabelWithAsteriskProps> = ( props ) => {
    const {
        label
    } = props
    return(
        <Box flex={1} flexDirection="row">
            <Text color={"primary"} variant="heading5" fontWeight={"bold"}>{label}</Text>
            <Text color={"lightRed"}> *</Text>
        </Box>
    )
}

export const AddObservationScreen: React.FunctionComponent<AddObservationScreenProps> = observer( ( ) => {
    const navigation = useNavigation()   
    const { DashboardStore,ObservationStore ,AuthStore, TaskStore } = useStores()
    const dashboard = DashboardStore._get( DashboardStore?.currentDashboardId )
    const [ topicList, setTopicList ] = useState( [] )
    const [ showTopic, setShowTopic ] = useState( false )
    const [ topicValue, setTopicValue ] = useState( "" )
    const [ loadingForSubmit, setLoadingForSubmit ] = useState( false )
    const [ loadingForSave, setLoadingForSave ] = useState( false )
    const [ loadingForAnonymous, setLoadingForAnonymous ] = useState( false )
    const [ refreshing, setRefreshing ] = useState( false )
    const [ isDataFetched, setIsDataFetched ] = useState( false )
    const [ showZoomViewer,setShowZoomViewer ] = useState( false )
    const keyboard = useKeyboard()


   
    useEffect( ( ) => {
        fetchAllFilterData()
    }, [] )

    const STYLES = useStyles()
    const todayDate = new Date()
    const timePickerIcon = { name: 'time-outline', type: 'ionicon', size: 28 ,color:'#1e5873' }

    useFocusEffect(
        React.useCallback( () => {
            refreshObservationImages()
        }, [ ObservationStore.isImageSelected ] )
    );

    const refreshObservationImages = ( ) => {
        setRefreshing( !refreshing )
    }

    const {
        touched,
        handleBlur,
        handleChange,
        errors,
        values,
        isValid
    } = useFormik( {
        initialValues: {
            whereObservationHappened: isEmpty( ObservationStore.editObservationData.DescribeWhereTheIncidentHappened )?"":ObservationStore.editObservationData.DescribeWhereTheIncidentHappened,
            observation: isEmpty( ObservationStore.editObservationData.Observation )?"":ObservationStore.editObservationData.Observation,
        },
        validationSchema: object( {
            whereObservationHappened: string()
                .required( '' ),
            observation: string()
                .required( 'Observation is required' )
        } ),
        async onSubmit ( values ) {
            // Where the observation happened is required
        },
    } )
    
   
    const fetchAllFilterData = useCallback( async () => {
        setIsDataFetched( true )
        await ObservationStore.setRadioValue( "0" )
        await ObservationStore.removeDocument()
        await ObservationStore.removeImages()
        await ObservationStore.resetSwitch()
        await TaskStore.setcurrentDueDateValue()
        await TaskStore.resetDatePicker()
        await TaskStore.resetTimePicker()
        await ObservationStore.resetSelectedUser()
        await ObservationStore.resetDropdowns()
        const payload = {
            UserID: AuthStore?.user.UserID,
            AccessToken: AuthStore?.token,
            ObservationSettingID: dashboard?.ObservationSettingID,
            CompanyID: AuthStore?.user?.CompanyID
        } as IAllCommanFilterPayload
        await ObservationStore.fetchAllCommanfilter( payload )
        setIsDataFetched( false )
        setDefaultValueForEdit ()

    }, [] )

    const onUserSelect = async ( item: ILocationsModel ) => {
        await ObservationStore.setSelectedUser( item )
        await ObservationStore.hideSearchableModal()
    }

    const renderItem = ( { item }: {item: ILocationsModel } ) => {
        return (
            <TouchableBox onPress={()=>onUserSelect( item )}>
                <ListItem containerStyle={STYLES.listItemContainerStyle}>
                    <Avatar 
                        rounded size={32} 
                        icon={{ name: 'user', type: 'font-awesome' }} 
                        containerStyle={STYLES.iconContainerStyle} 
                    />
                    <ListItem.Content>
                        <ListItem.Title>{item.Value}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            </TouchableBox>
        )
    }

    const onRadioPress = async ( value ) => {
        await ObservationStore.setRadioValue( value )
    }

    const onSectionValueChange = async ( value: any ) => {
        if ( isEmpty( value ) || value === null ) {
            await ObservationStore.setDropdown( "section", "" )
            setShowTopic( false )
            setTopicList( [] )
            setTopicValue( "" )
            return null
        }
        await ObservationStore.setDropdown( 'section',value )
        setTopicList( [] )
        const topicsBasedOnSections = ObservationStore.startobservation.Sections.find( item => item.ID === value )
        const topics = topicsBasedOnSections.Topics.map( item => {
            const topic = { label: item.Value, value: item.ID }
            return topic
        } )
        setTopicList( topics )
        setTopicValue( "" )
        setShowTopic( true )
    }

    const onSubmit = async ( ) => {
        setLoadingForSubmit( true )
        const validArray = [ values.whereObservationHappened, TaskStore.datePicker?.value,
            TaskStore.timePicker?.value, ObservationStore?.currentActOrConditions?.Value, ObservationStore.actOrConditions, values.observation ]
        const notValid = validArray.includes( "" )
        if( notValid ) {
            Toast.showWithGravity( 'Please fill all mandatory fields', Toast.LONG, Toast.CENTER );
            setLoadingForSubmit( false )
            return null
        }else if( ObservationStore.selectedUser && isEmpty( ObservationStore?.selectedUser?.ID ) ) {
            Toast.showWithGravity( 'Please select values from where did observation occur dropdown', Toast.LONG, Toast.CENTER );
            setLoadingForSubmit( false )
            return null
        }else{
            const payload = {
                UserID: AuthStore.user.UserID,
                AccessToken: AuthStore.token,
                LevelID: ObservationStore.selectedUser?.ID,
                ObservationSettingID: dashboard.ObservationSettingID,
                SectionID: ObservationStore.section,
                TopicID: topicValue,
                ActOrConditionID: ObservationStore.actOrConditions,
                ActOrCondition: ObservationStore.currentActOrConditions?.Value,
                HazardID: ObservationStore.hazards,
                Observation: values.observation,
                IsFollowUpNeeded: ObservationStore.radioValue,
                ObservationDate: TaskStore.datePicker?.value,
                ObservationTime: TaskStore.timePicker?.value,	
                DescribeWhereTheIncidentHappened: values.whereObservationHappened,
                ObservationID: ObservationStore?.editObservationData?.ObservationID

            } as ISubmitObservation
            const saveRecordResult = await ObservationStore.saveObservation( payload )
            if( saveRecordResult === "Success" ){
                setTimeout( () => {
                    setLoadingForSubmit( false )
                    ObservationStore.setRadioValue( "0" )
                    navigation.dispatch( StackActions.pop( 1 ) )
                }, 3000 )
            }
        }
    }

    const onSave = async ( ) => {
        setLoadingForSave( true )
        setLoadingForAnonymous( true )
        const validArray = [  TaskStore.datePicker?.value, values.observation ]

        const notValid = validArray.includes( "" )
        if( notValid ) {
            Toast.showWithGravity( 'Please fill Date and  Observation fields', Toast.LONG, Toast.CENTER );
            setLoadingForSave( false )
            return null
        }else if( ObservationStore.selectedUser && isEmpty( ObservationStore?.selectedUser?.Value ) ) {
            Toast.showWithGravity( 'Please select values from where did observation occur dropdown', Toast.LONG, Toast.CENTER );
            setLoadingForSave( false )
            return null
        }
        const payload = {
            UserID: AuthStore.user.UserID,
            AccessToken: AuthStore.token,
            LevelID: ObservationStore.selectedUser?.ID,
            ObservationSettingID: dashboard.ObservationSettingID,
            SectionID: ObservationStore.section,
            TopicID: topicValue,
            ActOrConditionID: ObservationStore.actOrConditions,
            ActOrCondition: ObservationStore.currentActOrConditions?.Value,
            HazardID: ObservationStore.hazards,
            Observation: values.observation,
            IsFollowUpNeeded: ObservationStore.radioValue,
            ObservationDate: TaskStore.datePicker?.value,
            ObservationTime: TaskStore.timePicker?.value,	
            DescribeWhereTheIncidentHappened: values.whereObservationHappened,
            ObservationID: ObservationStore?.editObservationData?.ObservationID

        } as ISubmitObservation

        const resultsaveAndComeBackObservationy = await ObservationStore.saveAndComeBackObservation( payload )
        // 
        if( resultsaveAndComeBackObservationy === "Success" ){
            setTimeout( () => {
                setLoadingForSave( false )
                ObservationStore.setRadioValue( "0" )
                navigation.dispatch( StackActions.pop( 1 ) )
            }, 3000 )
           
        }
    }

    const saveAsAnonymous = async ( ) => {
        setLoadingForAnonymous( true )
        const validArray = [ values.whereObservationHappened, TaskStore.datePicker?.value,
            TaskStore.timePicker?.value, ObservationStore?.currentActOrConditions?.Value, ObservationStore.actOrConditions, values.observation ]
        const notValid = validArray.includes( "" )
        if( notValid ) {
            Toast.showWithGravity( 'Please fill all mandatory fields', Toast.LONG, Toast.CENTER );
            setLoadingForAnonymous( false )
            return null
        }else if( ObservationStore.selectedUser && isEmpty( ObservationStore?.selectedUser?.Value ) ) {
            Toast.showWithGravity( 'Please select values from where did observation occur dropdown', Toast.LONG, Toast.CENTER );
            setLoadingForAnonymous( false )
            return null
        }
        const payload = {
            UserID: AuthStore.user.UserID,
            AccessToken: AuthStore.token,
            LevelID: ObservationStore.selectedUser?.ID,
            ObservationSettingID: dashboard.ObservationSettingID,
            SectionID: ObservationStore.section,
            TopicID: topicValue,
            ActOrConditionID: ObservationStore.actOrConditions,
            ActOrCondition: ObservationStore.currentActOrConditions?.Value,
            HazardID: ObservationStore.hazards,
            Observation: values.observation,
            IsFollowUpNeeded: ObservationStore.radioValue,
            ObservationDate: TaskStore.datePicker?.value,
            ObservationTime: TaskStore.timePicker?.value,	
            DescribeWhereTheIncidentHappened: values.whereObservationHappened
        } as ISubmitObservation
        const resultAnonymously =  await ObservationStore.saveObservationAnonymously( payload )
       
        if( resultAnonymously === "Success" ){
            setTimeout( () => {
                setLoadingForAnonymous( false )
                ObservationStore.setRadioValue( "0" )
                navigation.dispatch( StackActions.pop( 1 ) )
            }, 3000 )
          
            setLoadingForAnonymous( false )
            // navigation.navigate( "ObservationHistory" )
        }
    }

    const onpressCamera =()=>{
        navigation.navigate( "CaptureImage",{ 
            calledFrom:"Observation"
        }
        )
        return null

    }
    const documentPicker = async ( ) => {
        try {
            const res = await DocumentPicker.pick( {
                type: [ DocumentPicker.types.pdf ],

            } );
            const documentobject = {
                fileCopyUri: res[0]?.fileCopyUri,
                type: res[0].type,
                size: res[0]?.size,
                name: res[0]?.name,
                uri: `${res[0].uri}`
            } as IDocument
            await ObservationStore.removeDocument()
            await ObservationStore.setDocument( documentobject ) 

        } catch ( err ) {
            if ( DocumentPicker.isCancel( err ) ) {
                Toast.showWithGravity( err.Message, Toast.LONG, Toast.TOP );
                return null
            } else {
                Toast.showWithGravity( err.Message, Toast.LONG, Toast.TOP );
                return null
            }
        }
    }

    const renderImage = ( ) => { 
        if( ObservationStore.isObservationImagePresent ) {
            return(
                <Box flex={1} width={100} height={100} justifyContent={"center"} alignItems={"center"} mb={"large"}>
                    <Box bg="transparent">
                        <Image
                            source={{ uri: ObservationStore?.UploadImage[0]?.uri }}
                            style={STYLES.imageStyle}
                        />
                    </Box>
                </Box>     
            )
         
        }else{
            return null
        }
    }


    const renderDocument = ( ) => {
        if( ObservationStore.isObservationDocumentPresent ) {
            return (
                <Box ml="regular" width={100} height={100} justifyContent={"center"} alignItems={"center"} mb={"large"}>
                    <Icon name="document-outline" size={64} type="ionicon" />
                    <Text textAlign={"center"}>{ObservationStore.UploadDocument[0]?.name}</Text>
                </Box>
            )
        }else{
            return null
        }
    }

    if( isDataFetched ) {
        return (
            <Box position="absolute" top={0} left={0} right={0} bottom={0} alignItems="center" justifyContent="center">
                <ActivityIndicator size={32} color="red" />
            </Box>
        )
    }


    const setDefaultValueForEdit = async ()=>{
        if( ObservationStore.editObservationData.ObservationID != null ){
         
            const userItem = ObservationStore.startobservation.Locations.find( item => item.ID === ObservationStore.editObservationData.LevelID )
            await ObservationStore.setSelectedUser( userItem )
            await ObservationStore.setRadioValue( ObservationStore.editObservationData.IsFollowUpNeeded )
            await TaskStore.formatTimeStringPass( ObservationStore.editObservationData.ObservationTime )
            await TaskStore.formatDateStringPass( ObservationStore.editObservationData.ObservationDate )
            await ObservationStore.setSectionId( ObservationStore.editObservationData.SectionID )
            const topicsBasedOnSections = ObservationStore.startobservation.Sections.find( item => item.ID === ObservationStore.editObservationData.SectionID )
            const topics = topicsBasedOnSections.Topics.map( item => {
                const topic = { label: item.Value, value: item.ID }
                return topic
            } )
            await setTopicList( topics )
            setTopicValue( ObservationStore.editObservationData.TopicID )
            await ObservationStore.setActOrConditionId( ObservationStore.editObservationData.ActOrConditionID )
            await ObservationStore.sethazardsId( ObservationStore.editObservationData.HazardID )

        }


        
    }
    const renderImageItem = ( { item, index } ) => {
        let formattedUrl = `${AuthStore.environment.api.apisauce.getBaseURL()}${item.FilePath}`
        formattedUrl = formattedUrl.replace( "/MobileAPI/api", "" )
        return (
            <Box flex={1} flexDirection="row" marginHorizontal="medium">
                <RenderImage 
                    image={item}
                    customUri={`${formattedUrl}`}
                    style={STYLES.imageStyle as StyleProp<ImageStyle>}
                    showDeleteIcon={false}
                    onImagePress={onImagePress}
                />
            </Box>
        )
    }
    const onImagePress = ( ) => {
        setShowZoomViewer( true )
    }

    const onRequestClose = ( ) => {
        setShowZoomViewer( false )
    }


    return (
        <Box flex={1}>
            <FormHeader 
                title={ObservationStore.editObservationData.ObservationID == null ?"Add Observation" :"Edit Observation"}
                navigation={navigation}
                rightComponent={
                    ObservationStore.editObservationData.ObservationID == null  ?   <RightSwitch  isEnabled={ObservationStore.isSwitchOn} toggleSwitch={ObservationStore.toggleSwitch}/> :null
        
                }    />                        
            <ScrollBox flex={1} mt="regular">
                {
                    ObservationStore.showModal 
                        ? <SearchableList
                            data={ObservationStore.startobservation?.Locations}
                            customRender={renderItem}
                            isModalVisible={ObservationStore.showModal}
                            closeModal={ObservationStore.hideSearchableModal}
                            onUserSelect={onUserSelect}
                            searchKey={"Value"}
                            key={"ID"}
                        /> 
                        : <Box mx="medium">
                            <Input 
                                label={<LabelWithAsterisk label="Where did the Observation occur" />}
                                placeholder="Click Here"
                                value={ObservationStore.selectedUser?.Value ?? ""}
                                onTouchStart={ObservationStore.displaySearchableModal}
                            />
                        </Box>
                }
                <Box mx="medium">
                    <TextAreaInput 
                        label={<LabelWithAsterisk label="Describe where the Observation happened"/>}
                        labelStyle={{ color: theme.colors.primary, fontSize: theme.textVariants.heading5?.fontSize  }}
                        placeholder="Type Here"
                        defaultValue={ObservationStore.editObservationData?.DescribeWhereTheIncidentHappened}    
                        onChangeText={handleChange( "whereObservationHappened" )}
                        onBlur={handleBlur( "whereObservationHappened" )}
                        error={touched.whereObservationHappened && errors.whereObservationHappened}
                    /> 
                </Box>
                <Box mx="medium">
                    <CustomDateTimePicker
                        label={<LabelWithAsterisk label="What was the Date of the Observation" />}
                        onPress={TaskStore.showDatePicker}
                        show={TaskStore.datePicker?.show}
                        inputValue={isEmpty( TaskStore.datePicker?.value ) ? TaskStore.currentDueDateValue : TaskStore.datePicker?.value }
                        value={TaskStore.datePicker?.datePickerValue}
                        mode="date"
                        maximumDate={todayDate}
                        onConfirm={TaskStore.formatDate}
                        onCancel={TaskStore.hideDatePicker}
                    />
                </Box>
                <Box mx="medium">
                    <CustomDateTimePicker
                        label={<LabelWithAsterisk label="What was the Time of the Observation" />}
                        placeholder="Select Time"
                        onPress={TaskStore.showTimePicker}
                        show={TaskStore.timePicker?.show}
                        inputValue={TaskStore.timePicker?.value ?? ""}
                        value={TaskStore.timePicker?.datePickerValue}
                        mode="time"
                        customRightIcon={timePickerIcon}
                        minuteInterval={10}
                        display={'spinner'}
                        onConfirm={TaskStore.formatTime}
                        onCancel={TaskStore.hideTimePicker}
                    />
                </Box>
                <Box mx="medium" mt="negative8">
                    <Radio 
                        radioList={RADIO_LIST}
                        label="Followup Needed"
                        onPress={onRadioPress}
                        initial= {  Number( ObservationStore.editObservationData.IsFollowUpNeeded ) == null ?  Number( ObservationStore.radioValue ):  Number( ObservationStore.editObservationData.IsFollowUpNeeded )}
                    />
                </Box>
                <Box>
                    <Dropdown
                        title="Section"
                        items={ObservationStore.sectionList}
                        value={ObservationStore.section}
                        onValueChange={ async ( value )=> {
                            onSectionValueChange( value )
                        }}
                    />
                </Box>
                {
                    showTopic
                        ?  <Box>
                            <Dropdown
                                title="Topic"
                                items={topicList}
                                value={topicValue}
                                onValueChange={( value )=>setTopicValue( value )}
                            />
                        </Box>
                        : null
                }
                <Box>
                    <Dropdown
                        title="Act or Condition"
                        items={ObservationStore.actOrConditionsList}
                        value={ObservationStore.actOrConditions}
                        onValueChange={( value )=>ObservationStore.setDropdown( 'actOrConditions', value )}
                        isRequired={true}
                    />
                </Box>
                            
                <Box>
                    <Dropdown
                        title={ObservationStore.HazardLabel}
                        items={ObservationStore.hazardList}
                        value={ObservationStore.hazards}
                        onValueChange={( value )=>ObservationStore.setDropdown( 'hazards', value )}
                    />
                </Box>           
                <Box mx="medium" mt="regular">
                    <TextAreaInput 
                        label={<LabelWithAsterisk label="Observation" />}
                        labelStyle={{ color: theme.colors.primary, fontSize: theme.textVariants.heading5?.fontSize  }}
                        placeholder="Type Here"
                        defaultValue={ObservationStore.editObservationData?.Observation}
                        onChangeText={handleChange( "observation" )}
                        onBlur={handleBlur( "observation" )}
                        error={touched.observation && errors.observation}
                    /> 
                </Box>
                <Box alignItems={"center"} flexDirection={"row"}>
                    {/* {
                        renderDocument()
                    } */}
                    {
                        renderImage()
                    }{
                        <Box flex={1} flexDirection="row" marginHorizontal="regular">
                            {
                                showZoomViewer 
                                    ? <Modal 
                                        style={STYLES.modalContainerStyle}
                                        visible={showZoomViewer}
                                        onRequestClose={onRequestClose}
                                    >
                                        <ImageViewer
                                            imageUrls={ObservationStore.ImageForZoom( AuthStore.environment.api.apisauce.getBaseURL() ) as any}
                                            index={0}
                                        />
                                        <Box position="absolute" top={20} right={10}>
                                            <Avatar size="medium" onPress={onRequestClose} rounded icon={{ name: 'close' }} containerStyle={STYLES.avatarContainerStyle}/>
                                        </Box>
                                    </Modal>
                                    : <FlatList 
                                        data={ObservationStore.editObservationData.ObservationFiles}
                                        // extraData={refresh}
                                        keyExtractor={( item,index ) => String( index ) }
                                        renderItem={renderImageItem}
                                        horizontal={true}
                                    /> 
                            }
                        </Box>
                    }                 
                </Box>  
            </ScrollBox>
            <Box>
                <Box position="absolute" bottom={20} right={10}>{

                    ObservationStore.editObservationData.ObservationFiles.length <=3 
                        ? <Avatar size="medium"  rounded icon={{ name: 'camera', type: 'feather' }} containerStyle={STYLES.iconContainerStyle} onPress={onpressCamera}/>
                        :null
                 
                    

                }
                {/* <Box mt="regular">
                        <Avatar size="medium"  rounded icon={{ name: 'file-pdf-o', type: 'font-awesome' }} containerStyle={STYLES.iconContainerStyle}onPress={documentPicker}/>
                    </Box> */}
                </Box>
                {
                    keyboard.keyboardShown
                        ? <Box style={STYLES.keyboardStyle}
                        />
                        : null
                }
            </Box>
            <Box>
                {
                    ObservationStore.isSwitchOn
                        ? <Button 
                            title="Submit as Anonymous"
                            onPress={saveAsAnonymous}
                            loading={loadingForAnonymous}
                        />
                        : 
                        <Box justifyContent={"space-evenly"} flexDirection={"row"} alignItems={"center"} m={"negative8"} >
                            <Box width={"50%"}>
                                <Button 
                                    title="Submit"
                                    onPress={onSubmit}
                                    loading={loadingForSubmit}
                                />
                            </Box>
                            <Box width={"50%"}>
                                <Button
                                    title="Save"
                                    onPress={onSave}
                                    loading={loadingForSave}
                                />
                            </Box>       
                        </Box>
                           
                }           
            </Box>
        </Box>
    )
} )