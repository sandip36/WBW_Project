import { useNavigation } from "@react-navigation/native"
import { Box, Button, Input, InputWithIcon, Text, TextAreaInput, TouchableBox } from "components"
import { useFormik } from "formik"
import { IImages, useStores } from "models"
import React, { useCallback, useEffect } from "react"
import { makeStyles, theme } from "theme"
import { object, string } from "yup"
import { ActivityIndicator, ImageStyle, StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { IAssignTaskPayload, IFetchRiskRatingPayload, IFetchTaskRatingDetailsPayload } from "services/api"
import { Async } from "react-async"
import { Dropdown } from "components/core/dropdown"
import { isEmpty } from "lodash"
import { CustomDateTimePicker } from "components/core/date-time-picker/date-time-picker"
import { SearchableList } from "components/searchable-input/searchable-input"
import { IUserList } from "models/models/task-model/user-list-model"
import Toast from "react-native-simple-toast"
import { RenderImage } from "components/inspection"


export type AssignTaskScreenProps = {

}
export type RiskRatingScreenProps = {
    riskRatingValue: string,
}

const useStyles = makeStyles<{contentContainerStyle: StyleProp<ViewStyle>, imageStyle: StyleProp<ImageStyle>, customContainerStyle: StyleProp<ViewStyle>}>( ( theme ) => ( {
    contentContainerStyle: {
        paddingBottom: theme.spacing.extraLarge
    },
    imageStyle: {
        width: 100,
        height: 100,
        borderRadius: theme.borderRadii.medium,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    customContainerStyle: {
        marginHorizontal: theme.spacing.regular
    }
} ) )

const todayDate = new Date()
export const RiskRating: React.FunctionComponent<RiskRatingScreenProps> = observer( ( props ) => {
    const { 
        riskRatingValue,
    } = props
    const { TaskStore } = useStores()
    return (
        <Box flex={1} bg="transparent" flexDirection="row" marginTop="medium">
            <Box flex={1} mt="medium">
                <Input 
                    label="Risk Rating *"
                    placeholder="Risk Rating"
                    value={riskRatingValue}
                    editable={false}
                />
                <Box flex={1}>
                    <CustomDateTimePicker
                        label="Due Date *"
                        onPress={TaskStore.showDatePicker}
                        show={TaskStore.datePicker?.show}
                        inputValue={isEmpty( TaskStore.datePicker?.value ) ? TaskStore.currentDueDateValue : TaskStore.datePicker?.value }
                        value={TaskStore.datePicker?.datePickerValue}
                        mode="date"
                        minimumDate={todayDate}
                        onConfirm={TaskStore.formatDate}
                        onCancel={TaskStore.hideDatePicker}
                    />
                </Box>
            </Box>
        </Box>
    )
} )

// TODO: Add autocomplete or searchable dropdown component
// TODO: Add image implementation and implement Images API separately. 
export const AssignTaskScreen: React.FC<AssignTaskScreenProps> = observer( ( props ) => {
    const { TaskStore, AuditStore, AuthStore } = useStores()
    const navigation = useNavigation()
    const STYLES = useStyles()
    const hazardValue = AuditStore.hazardList.find( item => item.value === TaskStore.currentHazardId )

    const {
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        errors,
        isValid,
        values,
        isValidating,
        isSubmitting
    } = useFormik( {
        initialValues: {
            taskTitle: TaskStore.currentTitle,
            description: "",
            riskRatingValue: "",
        },
        async onSubmit ( values ) {
            const isValid = [
                values.taskTitle,
                TaskStore.currentSeverityRating,
                TaskStore.currentProbabilityRating,
                values.description,
                TaskStore.currentRatingValue,
                TaskStore.currentDueDateValue,
                TaskStore.selectedUser?.UserID
            ]
            const notValidPayload = isValid.includes( "" ) || isValid.includes( undefined ) || isValid.includes( null )
            if( notValidPayload ) {
                Toast.showWithGravity( 'Please fill all the details marked as required', Toast.LONG, Toast.CENTER );
                return null
            }
            const payload = {
                UserID: AuthStore.user.UserID,
                AccessToken: AuthStore.token,
                AuditAndInspectionID: AuditStore.inspection?.AuditAndInspectionDetails?.AuditAndInspectionID,
                TaskTitle: values.taskTitle,
                Description: values.description,
                AttributeID: TaskStore.attributeID,
                AssignedToUserID: TaskStore.selectedUser?.UserID,
                DueDate: isEmpty( TaskStore.datePicker?.value ) ? TaskStore.currentDueDateValue : TaskStore.datePicker?.value,
                SeverityRating: TaskStore.currentSeverityRating,
                ProbabilityRating: TaskStore.currentProbabilityRating,
                RiskRating: TaskStore.currentRatingValue,
                HazardsID: TaskStore.currentHazardId, 
                CustomFormResultID: TaskStore.customFormResultID
            } as IAssignTaskPayload
            const response = await TaskStore.assignTask( payload, TaskStore.taskImage )
            if( response === 'success' ) {
                await setTimeout( ( ) => {
                    navigation.goBack()
                }, 3000 )
            }
        },
    } )

    const fetchTaskRatingsDetails = useCallback( async () => {
        await TaskStore.resetCurrentSeverityRatingValue()
        await TaskStore.resetCurrentProbabilityRatingValue()
        await TaskStore.resetSelectedUser()
        const payload = {
            UserID: AuthStore.user?.UserID,
            AccessToken: AuthStore.token,
            LevelID: AuthStore.user?.LevelID
        } as IFetchTaskRatingDetailsPayload
        await TaskStore.fetchTaskRatingDetails( payload )
    }, [] )

    const fetchRiskRating = async ( ) => {
        const payload = {
            UserID: AuthStore.user?.UserID,
            AccessToken: AuthStore.token,
            AuditAndInspectionID: AuditStore?.inspection?.AuditAndInspectionDetails?.AuditAndInspectionID,
            SeverityRateValue: TaskStore.currentSeverityRating,
            ProbabilityRateValue: TaskStore.currentProbabilityRating
        } as IFetchRiskRatingPayload
        const result = await TaskStore.fetchRiskRating( payload )
        return result
    }

    /**
     * Description of change: should only fetch risk rating when 
     * a.) severity and probability rating is not empty
     * b.) if severity rating exists and probabilty rating changed.
     */
    const shouldFetchRiskRating = useCallback( async () => {
        if( !isEmpty( TaskStore.currentSeverityRating ) && !isEmpty( TaskStore.currentProbabilityRating ) ) {
            const response = await fetchRiskRating()
            return response
        }else{
            return null
        }
    }, [] ) 

    const onUserSelect = async ( item: IUserList ) => {
        await TaskStore.setSelectedUser( item )
        await TaskStore.hideSearchableModal()
    }

    const onImageSelected = async ( value: IImages ) => {
        await TaskStore.addTaskImage( value )
    }

    useEffect( ( ) => {
        resetImage()
    }, [] )

    const resetImage = ( ) => {
        deleteTaskImage()
    }

    const openImagePickerOptions = ( ) => {
        navigation.navigate( 'CaptureTaskImage', {
            callback: ( value: IImages ) => onImageSelected( value )
        } )
    }

    const deleteTaskImage = async ( ) => {
        await TaskStore.removeTaskImage( )
    }


    return (
        <Box flex={1}>
            <Async promiseFn={fetchTaskRatingsDetails}>
                <Async.Pending>
                    { ( ) => (
                        <Box flex={1} alignItems="center" justifyContent="center">
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
                    <Box
                        flex={1}
                        marginHorizontal="regular" marginVertical="regular">
                        <Box flexDirection="row" marginHorizontal="regular" marginVertical="medium">
                            <Text variant="heading5" fontWeight="bold">Selected Hazard: </Text>
                            <Text marginHorizontal="medium">
                                {hazardValue?.label}
                            </Text>
                        </Box>
                        <Box mt="regular" marginHorizontal="small">
                            <TextAreaInput 
                                label="Task Title *"
                                labelStyle={{ color: theme.colors.primary, fontSize: theme.textVariants.heading5?.fontSize  }}
                                placeholder="Please provide task title"
                                defaultValue={TaskStore.currentTitle}
                                onChangeText={handleChange( "taskTitle" )}
                                onBlur={handleBlur( "taskTitle" )}
                            />
                            {
                                TaskStore.showModal 
                                    ? <SearchableList
                                        data={TaskStore.taskRatingFilters?.UserList}
                                        isModalVisible={TaskStore.showModal}
                                        closeModal={TaskStore.hideSearchableModal}
                                        onUserSelect={onUserSelect}
                                    />
                                    : <Input 
                                        label="User List *"
                                        placeholder="Please select user"
                                        value={TaskStore.selectedUser?.FullName ?? ""}
                                        onTouchStart={TaskStore.displaySearchableModal}
                                    />
                            }
                            
                            <TextAreaInput 
                                label="Description *"
                                labelStyle={{ color: theme.colors.primary, fontSize: theme.textVariants.heading5?.fontSize  }}
                                placeholder="Please provide description"
                                value={values.description}
                                onChangeText={handleChange( "description" )}
                                onBlur={handleBlur( "description" )}
                            /> 
                        </Box>
                        <Box marginVertical="negative8">
                            <Dropdown
                                title="Severity Rating *"
                                items={TaskStore.severityRatingList}
                                value={TaskStore.currentSeverityRating}
                                onValueChange={( value )=>TaskStore.setCurrentSeverityRatingValue( value )}
                                customContainerStyle={STYLES.customContainerStyle}
                            />
                            <Box mt="mini">
                                <Dropdown
                                    title="Probability Rating *"
                                    items={TaskStore.probabilityRatingList}
                                    value={TaskStore.currentProbabilityRating}
                                    onValueChange={( value )=>{
                                        TaskStore.setCurrentProbabilityRatingValue( value )
                                    }}
                                    customContainerStyle={STYLES.customContainerStyle}
                                />
                            </Box>
                        </Box>
                        <Box>
                            <Async promiseFn={shouldFetchRiskRating} watch={[ TaskStore.currentProbabilityRating,TaskStore.currentSeverityRating ]}>
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
                                    {
                                        ( ratingData: any ) => 
                                            (
                                                !isEmpty( ratingData ) 
                                                    ? <Box flex={1}>
                                                        <RiskRating 
                                                            riskRatingValue={ratingData?.data?.RiskRating}
                                                        />
                                                    </Box>
                                                    : null
                                            )
                                    }
                                </Async.Resolved>
                            </Async>
                        </Box>
                        {
                            isEmpty( TaskStore.taskImage?.uri ) 
                                ? <TouchableBox mt="medium" onPress={openImagePickerOptions}>
                                    <InputWithIcon 
                                        rightIcon={{ name: 'camera', type: 'font-awesome' }}
                                        labelStyle={{ color: theme.colors.primary , fontSize: theme.textVariants?.heading5?.fontSize }}
                                        editable={false}
                                        label="Upload Image"
                                        placeholder="Upload Image"
                                        // onChangeText={handleChange( "username" )}
                                    /> 
                                </TouchableBox> 
                                : <Box flex={1} justifyContent="center" alignItems={"center"}>
                                    <RenderImage 
                                        image={TaskStore.taskImage}
                                        style={STYLES.imageStyle}
                                        deleteImage={deleteTaskImage}
                                    />
                                </Box>
                        }
                        <Box mt="medium">
                            <Button 
                                title="Assign Task"
                                onPress={handleSubmit}
                                disabled={!isValid || isValidating || isSubmitting}
                                loading={isValidating || isSubmitting}
                            />
                        </Box>
                    </Box>
                </Async.Resolved>
            </Async>
        </Box>
    )
} )