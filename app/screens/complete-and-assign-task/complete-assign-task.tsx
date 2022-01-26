import { useNavigation } from "@react-navigation/native"
import { Box, Radio, ScrollBox, Text } from "components"
import { FormHeader } from "components/core/header/form-header"
import { useStores } from "models"
import React, { useCallback } from "react"
import { Async } from "react-async"
import { ActivityIndicator } from "react-native"
import { IFetchTaskPayload } from "services/api"
import { CompleteTaskScreen, AssignTaskScreen } from "screens/complete-and-assign-task"
import { observer } from "mobx-react-lite"

export type CompleteOrAssignTaskScreenProps = {

}

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
                        <ScrollBox flex={1}>
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
                    </Box>
                </Async.Resolved>
            </Async>
        </Box>
    )
} )