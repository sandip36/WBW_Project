import { useNavigation } from "@react-navigation/native"
import { Box, Text } from "components"
import { FormHeader } from "components/core/header/form-header"
import { useStores } from "models"
import React, { useCallback } from "react"
import { Async } from "react-async"
import { ActivityIndicator } from "react-native"
import { isEmpty  } from "lodash"
import { IFetchDataForStartInspectionPayload } from "services/api"

export type StartInspectionScreenProps = {

}

export const StartInspectionScreen: React.FC<StartInspectionScreenProps> = ( ) => {
    const navigation = useNavigation()
    const { AuditStore, AuthStore , DashboardStore } = useStores()

    const dashboard = DashboardStore._get( DashboardStore?.currentDashboardId )
    if( isEmpty( dashboard ) ) {
        return null
    }

    const fetchDataForStartInspection = useCallback( async () => {
        const payload = {
            UserID: AuthStore?.user.UserID,
            AccessToken: AuthStore?.token,
            CustomFormID: dashboard?.CustomFormID,
            AuditAndInspectionTemplateID: dashboard?.AuditandInspectionTemplateID,
        } as IFetchDataForStartInspectionPayload
        await AuditStore.fetchDataForStartInspection( payload )
    }, [] )

    return (
        <Box flex={1}>
            <Async promiseFn={fetchDataForStartInspection}>
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
                            title={AuditStore?.audit?.TemplateDetails?.Title}
                            navigation={navigation}
                        />
                        <Text>Start Inspection</Text>
                    </Box>
                </Async.Resolved>
            </Async>
        </Box>
    )
}