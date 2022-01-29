import { useNavigation } from "@react-navigation/native"
import { Box, Button, Radio, ScrollBox, Text } from "components"
import { FormHeader } from "components/core/header/form-header"
import { useStores } from "models"
import React, { useCallback } from "react"
import { Async } from "react-async"
import { ActivityIndicator } from "react-native"
import { IDeleteTask, IFetchTaskPayload, IUpdateHazard } from "services/api"
import { CompleteTaskScreen, AssignTaskScreen } from "screens/complete-and-assign-task"
import { observer } from "mobx-react-lite"
import { AuditDetailsRow } from "components/audit-detail-row/audit-details-row"

export type CompleteOrAssignTaskScreenProps = {

}

export type TaskUpdateOrDeleteProps = {

}

export const TaskUpdateOrDelete: React.FunctionComponent<TaskUpdateOrDeleteProps> = observer( ( props ) => {
    const { TaskStore, AuditStore, AuthStore } = useStores()
    const navigation = useNavigation()
    const hazardValue = AuditStore.hazardList.find( item => item.value === TaskStore.currentHazardId )

    const updateHazard = async ( ) => {
        const payload = {
            UserID: AuthStore.user.UserID,
            AccessToken: AuthStore.token,
            HazardsID: TaskStore.currentHazardId,
            CustomFormResultID: TaskStore.customFormResultID
        } as IUpdateHazard
        const response = await TaskStore.updateHazard( payload )
        if( response === 'success' ) {
            await setTimeout( ( ) => {
                navigation.goBack()
            }, 3000 )
        }
    }

    const deleteTask = async ( ) => {
        const payload = {
            UserID: AuthStore.user.UserID,
            AccessToken: AuthStore.token,
            AuditAndInspectionTaskID: TaskStore.task?.AuditAndInspectionTaskDetails?.AuditAndInspectionTaskID,
            CustomFormResultID: TaskStore.customFormResultID
        } as IDeleteTask
        await TaskStore.deleteTask( payload )
    }

    return (
        <Box flex={1}>
            <Box>
                {/* <AuditDetailsRow 
                    title="Instructions: "
                    value={TaskStore.task?.Instructions}
                /> */}
                <Box marginHorizontal="medium" marginVertical="medium" backgroundColor="transparent">
                    <Box>
                        <Text pl="medium" pr="small" color="black" variant="heading5" fontWeight="bold">Instructions: </Text>
                    </Box>
                    <Box>
                        <Text pl="medium" pr="small" color="black" variant="body" textAlign="auto" numberOfLines={0}>{TaskStore.task?.Instructions}</Text>
                    </Box>
                </Box>
                <AuditDetailsRow 
                    title="Previous Hazards: "
                    value={TaskStore.task?.PreviousHazard}
                />
                <AuditDetailsRow 
                    title="New Hazards: "
                    value={hazardValue?.label}
                />
            </Box>
            <Box flexDirection="row">
                <Box width="50%">
                    <Button
                        title="Update Hazard"
                        onPress={updateHazard}
                    />
                </Box>
                <Box width="50%">
                    <Button 
                        title="Delete Task"
                        onPress={deleteTask}
                    />
                </Box>            
            </Box>

        </Box>
    )
} )

export const CompleteOrAssignTaskScreen: React.FC<CompleteOrAssignTaskScreenProps> = observer( ( props ) => {
    const { AuditStore, AuthStore, TaskStore } = useStores()
    const navigation = useNavigation()

    const fetchTasks = useCallback( async () => {
        await TaskStore.resetRadioValue()
        const payload = {
            UserID: AuthStore.user?.UserID,
            AccessToken: AuthStore.token,
            AuditAndInspectionID: AuditStore.inspection?.AuditAndInspectionDetails.AuditAndInspectionID,
            AttributeID: TaskStore.attributeID,
            CustomFormResultID: TaskStore.customFormResultID
        } as IFetchTaskPayload
        await TaskStore.fetch( payload )
    }, [] )

    const onRadioPress = async ( value ) => {
        if( value === "Assign Task" ) {
            await TaskStore.resetDatePicker()
        }
        await TaskStore.setRadioValue( value )
    }

    return (
        <Box flex={1}>
            <Async promiseFn={fetchTasks}>
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
                    <Box flex={1}>
                        <FormHeader 
                            title="Complete or Assign Task"
                            navigation={navigation}
                        />
                        {
                            TaskStore.isTaskPresent
                                ? <TaskUpdateOrDelete />
                                : <ScrollBox flex={1}>
                                    <Box flex={0.15}>
                                        <Radio 
                                            onPress={onRadioPress}
                                        />
                                    </Box>
                                    <Box flex={1}>
                                        {
                                            TaskStore.radioValue === "Complete Task"
                                                ? <CompleteTaskScreen />
                                                : <AssignTaskScreen />
                                        }
                                    </Box>
                                </ScrollBox>
                        }
                    </Box>
                </Async.Resolved>
            </Async>
        </Box>
    )
} )