import { useNavigation } from "@react-navigation/native"
import { Box, Button, Text } from "components"
import { FormHeader } from "components/core/header/form-header"
import { useStores } from "models"
import React, { useCallback } from "react"
import { Async } from "react-async"
import { ActivityIndicator } from "react-native"
import { isEmpty  } from "lodash"
import { IFetchDataForStartInspectionPayload, ISubmitStartInspectionPayload } from "services/api"
import { Dropdown } from "components/core/dropdown"
import { observer, Observer } from "mobx-react-lite"

export type StartInspectionScreenProps = {

}

export const StartInspectionScreen: React.FC<StartInspectionScreenProps> = observer( ( ) => {
    const navigation = useNavigation()
    const { AuditStore, AuthStore , DashboardStore } = useStores()

    const dashboard = DashboardStore._get( DashboardStore?.currentDashboardId )
    if( isEmpty( dashboard ) ) {
        return null
    }

    const fetchDataForStartInspection = useCallback( async () => {
        await AuditStore.resetPrimaryListID()
        await AuditStore.resetSecondaryListID()
        const payload = {
            UserID: AuthStore?.user.UserID,
            AccessToken: AuthStore?.token,
            CustomFormID: dashboard?.CustomFormID,
            AuditAndInspectionTemplateID: dashboard?.AuditandInspectionTemplateID,
        } as IFetchDataForStartInspectionPayload
        await AuditStore.fetchDataForStartInspection( payload )
    }, [] )

    const handleSubmit = async ( ) => {
        const payload = {
            UserID: AuthStore.user.UserID,
            AccessToken: AuthStore.token,
            CustomFormID: dashboard?.CustomFormID,
            AuditAndInspectionTemplateID: dashboard?.AuditandInspectionTemplateID,
            TypeID: AuditStore.currentPrimaryListID,
            PrimaryUserID: isEmpty( AuditStore.currentSecondaryListID ) ? AuthStore.user.UserID : AuditStore.currentSecondaryListID,
            Type: AuditStore?.audit?.TemplateDetails?.Type,
            CompanyID: AuthStore.user.CompanyID
        } as ISubmitStartInspectionPayload
        const result = await AuditStore.submitDataForStartInspection( payload )
        if( result === 'success' ) {
            navigation.navigate( 'Inspection' )
        }
    }

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
                        <Box mt="medium" marginHorizontal="regular">
                            <Text>
                                {`Select ${AuditStore?.audit?.TemplateDetails?.Type} that you want to audit and click start audit button`}
                            </Text> 
                        </Box>
                        <Box flex={AuditStore.shouldShowSecondaryList ? 0.40: 0.25 }>
                            <Dropdown
                                title={ `Select ${AuditStore?.audit?.TemplateDetails?.Type}` }
                                items={AuditStore.primaryList}
                                value={AuditStore?.currentPrimaryListID ?? "" }
                                onValueChange={( value )=>AuditStore.setCurrentPrimaryListID( value )}
                            />
                            {
                                AuditStore.shouldShowSecondaryList
                                    ? (
                                        <Dropdown
                                            title="Inspection on behalf of"
                                            items={AuditStore.secondaryList}
                                            value={AuditStore.currentSecondaryListID}
                                            onValueChange={( value )=>AuditStore.setCurrentSecondaryListID( value )}
                                        />
                                    )
                                    : null
                            }
                            <Box mt="medium">
                                <Button 
                                    title="Start"
                                    onPress={handleSubmit}
                                    disabled={AuditStore.shouldDisableStartInspection}
                                    loading={AuditStore.loading}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Async.Resolved>
            </Async>
        </Box>
    )
} )