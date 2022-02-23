import { FormHeader } from "components/core/header/form-header"
import React, { useCallback } from "react"
import { Async } from "react-async"
import { ActivityIndicator, StyleProp, ViewStyle } from "react-native"
import { Box, Button, CustomDateTimePicker, Input, Radio, ScrollBox, SearchableList, Text, TextAreaInput, TouchableBox } from "components"
import { useNavigation } from "@react-navigation/native"
import { IAllCommanFilterPayload } from "services/api"
import { makeStyles, theme } from "theme"
import { ILocationsModel, useStores } from "models"
import { Avatar, ListItem } from "react-native-elements"
import { observer } from "mobx-react-lite"
import { useFormik } from "formik"
import { object, string } from "yup"
import { isEmpty } from "lodash"
import { Dropdown } from "components/core/dropdown/custom-dropdown-component"



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
    { label: 'No', value: "No" },
    { label: 'Yes', value: "Yes" }
]
export const AddObservationScreen: React.FunctionComponent<AddObservationScreenProps> = observer( ( ) => {
    const navigation = useNavigation()   
    const { DashboardStore,ObservationStore ,AuthStore, TaskStore } = useStores()
    const dashboard = DashboardStore._get( DashboardStore?.currentDashboardId )
    const STYLES = useStyles()
    const todayDate = new Date()

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
        if( value === "No" ) {
            await TaskStore.resetDatePicker()
        }
        await TaskStore.setRadioValue( value )
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
                                : <Input 
                                    label="Where did the Observation occur *"
                                    placeholder="Click Here"
                                    value={ObservationStore.selectedUser?.Value ?? ""}
                                    onTouchStart={ObservationStore.displaySearchableModal}
                                />
                        }
                        <Box>
                            <TextAreaInput 
                                label="Describe where the Observation happened *"
                                labelStyle={{ color: theme.colors.primary, fontSize: theme.textVariants.heading5?.fontSize  }}
                                placeholder="Type Here"
                                onChangeText={handleChange( "whereObservationHappened" )}
                                onBlur={handleBlur( "whereObservationHappened" )}
                                error={touched.whereObservationHappened && errors.whereObservationHappened}
                            /> 
                        </Box>
                        <Box>
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
                        <Box>
                            <CustomDateTimePicker
                                label="What was the Time of the Observation *"
                                onPress={TaskStore.showTimePicker}
                                show={TaskStore.timePicker?.show}
                                inputValue={TaskStore.timePicker?.value ?? ""}
                                value={TaskStore.timePicker?.datePickerValue}
                                mode="time"
                                minuteInterval={10}
                                display={'spinner'}
                                onConfirm={TaskStore.formatTime}
                                onCancel={TaskStore.hideTimePicker}
                            />
                        </Box>
                        <Box mt="negative8">
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
                                onValueChange={ async ( value )=>{
                                    if( value === null || value === undefined ) {
                                        ObservationStore.hideShowTopic()
                                        ObservationStore.setDropdown( 'section',"" )
                                    }else{
                                        ObservationStore.hideShowTopic()
                                        ObservationStore.setDropdown( 'section',value )
                                        ObservationStore.displayShowTopic()
                                    }
                                }}
                            />
                        </Box>
                        {
                            ObservationStore.showTopic
                                ?  <Box>
                                    <Dropdown
                                        title="Topic"
                                        items={ObservationStore.topicList}
                                        value={ObservationStore.topic}
                                        onValueChange={( value )=>ObservationStore.setDropdown( 'topic',value )}
                                    />
                                </Box>
                                : null
                        }
                        <Box>
                            <Dropdown
                                title="Act or Condition *"
                                items={ObservationStore.actOrConditionsList}
                                value={ObservationStore.actOrConditions}
                                onValueChange={( value )=>ObservationStore.setDropdown( 'actOrConditions',value )}
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
                        <Box>
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
                    <Box justifyContent={"space-evenly"} flexDirection={"row"} alignItems={"center"} m={"negative8"} >
                        <Box width={"50%"}>
                            <Button 
                                title="Submit"
                            // onPress={onSubmit}
                            />
                        </Box>
                        <Box width={"50%"}>
                            <Button
                                title="Save"
                            // onPress={onSubmit}
                            />
                        </Box>                  
                    </Box>
                </Async.Resolved>
            </Async>
        </Box>
    )
} )