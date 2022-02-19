import { useNavigation } from "@react-navigation/native"
import { Box, Button, InputWithIcon, Text, TextAreaInput, TouchableBox } from "components"
import { useFormik } from "formik"
import { IImages, useStores } from "models"
import React, { useEffect } from "react"
import { makeStyles, theme } from "theme"
import { object, string } from "yup"
import { ImageStyle, StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { ICompleteTaskPayload } from "services/api"
import { isEmpty } from "lodash"
import { RenderImage } from "components/inspection"

export type CompleteTaskScreenProps = {

}

const useStyles = makeStyles<{contentContainerStyle: StyleProp<ViewStyle>, imageStyle: StyleProp<ImageStyle>}>( ( theme ) => ( {
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
    }
} ) )

// TODO: Add image API and UI implementation along with existing complete task API.
export const CompleteTaskScreen: React.FC<CompleteTaskScreenProps> = observer( ( props ) => {
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
        isSubmitting,
    } = useFormik( {
        initialValues: {
            taskTitle: TaskStore.currentTitle,
            comments: "",
        },
        validationSchema: object( {
            taskTitle: string()
                .required( 'Task title is required field' ),
            comments: string()
                .required()
        } ),
        async onSubmit ( values ) {
            const payload = {
                UserID: AuthStore.user?.UserID,
                AccessToken: AuthStore.token,
                AuditAndInspectionID: AuditStore.inspection?.AuditAndInspectionDetails.AuditAndInspectionID,
                TaskTitle: values.taskTitle,
                Comments: values.comments,
                AttributeID: TaskStore.attributeID,
                HazardsID: TaskStore.currentHazardId, 
                CustomFormResultID: TaskStore.customFormResultID
            } as ICompleteTaskPayload
            const response = await TaskStore.completeTask( payload, TaskStore.taskImage )
            if( response === 'success' ) {
                await setTimeout( ( ) => {
                    navigation.goBack()
                }, 3000 )
            }
        },
    } )

    useEffect( ( ) => {
        resetImage()
    }, [] )

    const resetImage = ( ) => {
        deleteTaskImage()
    }

    const onImageSelected = async ( value: IImages ) => {
        await TaskStore.addTaskImage( value )
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
                    value={values.taskTitle}
                    onChangeText={handleChange( "taskTitle" )}
                    onBlur={handleBlur( "taskTitle" )}
                    error={touched.taskTitle && errors.taskTitle}
                /> 
                <TextAreaInput 
                    label="Comments *"
                    labelStyle={{ color: theme.colors.primary, fontSize: theme.textVariants.heading5?.fontSize  }}
                    placeholder="Please provide comments"
                    value={values.comments}
                    onChangeText={handleChange( "comments" )}
                    onBlur={handleBlur( "comments" )}
                    error={touched.comments && errors.comments}
                />
                {
                    isEmpty( TaskStore.taskImage?.uri ) 
                        ? <TouchableBox onPress={openImagePickerOptions}>
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
            </Box>
            <Box mt="medium">
                <Button 
                    title="Complete Task"
                    onPress={handleSubmit}
                    disabled={!isValid || isValidating || isSubmitting}
                    loading={isValidating || isSubmitting}
                />
            </Box>
        </Box>
    )
} )