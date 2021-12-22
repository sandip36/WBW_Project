import { useNavigation } from "@react-navigation/native"
import { Box, Text } from "components"
import { FormHeader } from "components/core/header/form-header"
import { useStores } from "models"
import React, { useCallback } from "react"
import { Async } from "react-async"
import { ActivityIndicator } from "react-native"
import { isEmpty } from "lodash"
import { IFetchEditInspectionDetailsPayload } from "services/api"

export type EditInspectionScreenProps = {

}

export const EditInspectionScreen: React.FC<EditInspectionScreenProps> = ( ) => {
    const navigation = useNavigation()      
    const { DashboardStore, AuditStore, AuthStore } = useStores()
    const fetchEditInspectionDetails = useCallback( async () => {
        const dashboard = DashboardStore._get( DashboardStore?.currentDashboardId )
        if( isEmpty( dashboard ) ) {
            return null
        }
        const payload = {
            UserID: AuthStore?.user.UserID,
            AccessToken: AuthStore?.token,
            CustomFormID: dashboard?.CustomFormID,
            AuditAndInspectionTemplateID: dashboard?.AuditandInspectionTemplateID,
            AuditAndInspectionId: AuditStore?.currentInspectionId,
            CompanyID: AuthStore?.user?.CompanyID
        } as IFetchEditInspectionDetailsPayload
        await AuditStore.fetchDataForEditInspection( payload )
    }, [] )

    return (
        <Box flex={1}>
            <Async promiseFn={fetchEditInspectionDetails}>
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
                        title="Edit Inspection"
                        navigation={navigation}
                    />
                </Async.Resolved>
            </Async>
        </Box>
    )
}