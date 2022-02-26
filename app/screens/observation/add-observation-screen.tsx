import { FormHeader } from "components/core/header/form-header"
import React, { useCallback, useState } from "react"
import { Async } from "react-async"
import { ActivityIndicator, StyleProp, Switch, ViewStyle } from "react-native"
import { Box, Button, CustomDateTimePicker, Input, Radio, ScrollBox, SearchableList, Text, TextAreaInput, TouchableBox } from "components"
import { useNavigation } from "@react-navigation/native"
import { IAllCommanFilterPayload, ISubmitObservation } from "services/api"
import { makeStyles, theme } from "theme"
import { ILocationsModel, useStores } from "models"
import { Avatar, Icon, ListItem } from "react-native-elements"
import { Observer, observer } from "mobx-react-lite"
import { useFormik } from "formik"
import { object, string } from "yup"
import { isEmpty } from "lodash"
import { Dropdown } from "components/core/dropdown/custom-dropdown-component"
import Toast from 'react-native-simple-toast';




export type AddObservationScreenProps = {

}

export type AddObservationStyleProps = {
    containerStyle: StyleProp<ViewStyle>,
    listItemContainerStyle: StyleProp<ViewStyle>,
    iconContainerStyle: StyleProp<ViewStyle>,
    searchBarContainerStyle: StyleProp<ViewStyle>
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
    }
} ) )

const RADIO_LIST = [
    { label: 'No', value: "0" },
    { label: 'Yes', value: "1" }
]

export type RightSwitchProps = {
    isEnabled?: boolean,
    toggleSwitch?: ( value ) => any
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

export const AddObservationScreen: React.FunctionComponent<AddObservationScreenProps> = observer( ( ) => {
    const navigation = useNavigation()   
    const { DashboardStore,ObservationStore ,AuthStore, TaskStore } = useStores()
    const dashboard = DashboardStore._get( DashboardStore?.currentDashboardId )
    const [ topicList, setTopicList ] = useState( [] )
    const [ showTopic, setShowTopic ] = useState( false )
    const [ topicValue, setTopicValue ] = useState( "" )
    const STYLES = useStyles()
    const todayDate = new Date()
    const timePickerIcon = { name: 'time-outline', type: 'ionicon', size: 28 ,color:'#1e5873' }

    const {
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        errors,
        isValid,
        values,
        isValidating,
        isSubmitting,
    } = useFormik( {
        initialValues: {
            whereObservationHappened: "",
            observation: "",
        },
        validationSchema: object( {
            whereObservationHappened: string()
                .required( 'Where Observation Happened is a required field' ),
            observation: string()
                .required( 'Observation is a required field' )
        } ),
        async onSubmit ( values ) {
            //
        },
    } )
    

    const fetchAllFilterData = useCallback( async () => {
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
    }, [ ] )

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
        console.log( 'value is ',value )
        if( value === "0" ) {
            await TaskStore.resetDatePicker()
        }
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
        console.log( 'topics',JSON.stringify( topics ) )
        setTopicList( topics )
        setTopicValue( "" )
        setShowTopic( true )
    }

    const onSubmit = async ( ) => {
        console.log( 'Observation store',ObservationStore.currentActOrConditions )
        const validArray = [ values.whereObservationHappened, TaskStore.datePicker?.value,
            TaskStore.timePicker?.value, ObservationStore?.currentActOrConditions?.Value, ObservationStore.actOrConditions, values.observation ]
        console.log( values.whereObservationHappened, TaskStore.datePicker?.value,
            TaskStore.timePicker?.value, ObservationStore?.currentActOrConditions?.Value, ObservationStore.actOrConditions, values.observation )
        const notValid = validArray.includes( "" )
        if( notValid ) {
            Toast.showWithGravity( 'Please fill all the details marked as required', Toast.LONG, Toast.CENTER );
            return null
        }else if( ObservationStore.selectedUser && isEmpty( ObservationStore?.selectedUser?.ID ) ) {
            Toast.showWithGravity( 'Please select values from where did observation occur dropdown', Toast.LONG, Toast.CENTER );
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
                DescribeWhereTheIncidentHappened: values.whereObservationHappened
            } as ISubmitObservation
            console.log( 'payload for submit ',JSON.stringify( payload ) )
            await ObservationStore.saveObservation( payload )
        }
    }

    const onSave = async ( ) => {
        if( ObservationStore.selectedUser && isEmpty( ObservationStore.selectedUser?.ID ) ) {
            Toast.showWithGravity( 'Please select values from where did observation occur dropdown', Toast.LONG, Toast.CENTER );
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
        console.log( 'payload for save ',JSON.stringify( payload ) )
        await ObservationStore.saveAndComeBackObservation( payload )
    }

    const saveAsAnonymous = async ( ) => {
        const validArray = [ values.whereObservationHappened, TaskStore.datePicker?.value,
            TaskStore.timePicker?.value, ObservationStore?.currentActOrConditions?.Value, ObservationStore.actOrConditions, values.observation ]
        const notValid = validArray.includes( "" )
        if( notValid ) {
            Toast.showWithGravity( 'Please fill all the details marked as required', Toast.LONG, Toast.CENTER );
            return null
        }else if( ObservationStore.selectedUser && isEmpty( ObservationStore?.selectedUser?.Value ) ) {
            Toast.showWithGravity( 'Please select values from where did observation occur dropdown', Toast.LONG, Toast.CENTER );
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
        console.log( 'payload for anonymous ',JSON.stringify( payload ) )
        await ObservationStore.saveObservationAnonymously( payload )
    }

    return (
        <Box flex={1}>
            <Async promiseFn={fetchAllFilterData}>
                <Async.Pending>
                    { ( ) => (
                        <Box position="absolute" top={0} left={0} right={0} bottom={0} alignItems="center" justifyContent="center">
                            <ActivityIndicator size={32} color="red" />
                        </Box>
                    ) }
                </Async.Pending>
                <Async.Rejected>
                    { ( error: any ) => (
                        <Box justifyContent="center" alignItems="center" flex={1}>
                            <Text>{error.reason || error.message || 'Something went wrong'}</Text>
                        </Box>
                    ) }
                </Async.Rejected>
                <Async.Resolved>
                    <FormHeader 
                        title="Observation"
                        navigation={navigation}
                        rightComponent={<RightSwitch  isEnabled={ObservationStore.isSwitchOn} toggleSwitch={ObservationStore.toggleSwitch}/>}
                    />                        
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
                                        label="Where did the Observation occur *"
                                        placeholder="Click Here"
                                        value={ObservationStore.selectedUser?.Value ?? ""}
                                        onTouchStart={ObservationStore.displaySearchableModal}
                                    />
                                </Box>
                        }
                        <Box mx="medium">
                            <TextAreaInput 
                                label="Describe where the Observation happened *"
                                labelStyle={{ color: theme.colors.primary, fontSize: theme.textVariants.heading5?.fontSize  }}
                                placeholder="Type Here"
                                onChangeText={handleChange( "whereObservationHappened" )}
                                onBlur={handleBlur( "whereObservationHappened" )}
                                error={touched.whereObservationHappened && errors.whereObservationHappened}
                            /> 
                        </Box>
                        <Box mx="medium">
                            <CustomDateTimePicker
                                label="What was the Date of the Observation *"
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
                                label="What was the Time of the Observation *"
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
                                title="Act or Condition *"
                                items={ObservationStore.actOrConditionsList}
                                value={ObservationStore.actOrConditions}
                                onValueChange={( value )=>ObservationStore.setDropdown( 'actOrConditions', value )}
                            />
                        </Box>
                        <Observer>
                            {
                                ( ) => (
                                    <Box>
                                        <Dropdown
                                            title={ObservationStore.HazardLabel}
                                            items={ObservationStore.hazardList}
                                            value={ObservationStore.hazards}
                                            onValueChange={( value )=>ObservationStore.setDropdown( 'hazards', value )}
                                        />
                                    </Box>
                                )
                            }  
                        </Observer>
                        <Box mx="medium" mt="regular">
                            <TextAreaInput 
                                label="Observation *"
                                labelStyle={{ color: theme.colors.primary, fontSize: theme.textVariants.heading5?.fontSize  }}
                                placeholder="Type Here"
                                onChangeText={handleChange( "observation" )}
                                onBlur={handleBlur( "observation" )}
                                error={touched.observation && errors.observation}
                            /> 
                        </Box>
                    </ScrollBox>
                    <Box>
                        <Box position="absolute" bottom={20} right={10}>
                            <Avatar size="medium"  rounded icon={{ name: 'camera', type: 'feather' }} containerStyle={STYLES.iconContainerStyle}/>
                            <Box mt="regular">
                                <Avatar size="medium"  rounded icon={{ name: 'file-pdf-o', type: 'font-awesome' }} containerStyle={STYLES.iconContainerStyle}/>
                            </Box>
                        </Box>
                    </Box>
                    <Box>
                        {
                            ObservationStore.isSwitchOn
                                ? <Button 
                                    title="Save As Anonymous"
                                    onPress={saveAsAnonymous}
                                />
                                : 
                                <Box justifyContent={"space-evenly"} flexDirection={"row"} alignItems={"center"} m={"negative8"} >
                                    <Box width={"50%"}>
                                        <Button 
                                            title="Submit"
                                            onPress={onSubmit}
                                        />
                                    </Box>
                                    <Box width={"50%"}>
                                        <Button
                                            title="Save"
                                            onPress={onSave}
                                        />
                                    </Box>       
                                </Box>
                           
                        }           
                    </Box>
                </Async.Resolved>
            </Async>
        </Box>
    )
} )