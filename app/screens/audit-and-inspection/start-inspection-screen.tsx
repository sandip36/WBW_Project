import { useNavigation } from "@react-navigation/native"
import { Box, Button, Text } from "components"
import { FormHeader } from "components/core/header/form-header"
import { useStores } from "models"
import React, { useCallback, useEffect } from "react"
import { Async } from "react-async"
import { ActivityIndicator } from "react-native"
import { isEmpty  } from "lodash"
import { IAnyAuditInProcessPayload, IFetchDataForStartInspectionPayload, ISubmitStartInspectionPayload } from "services/api"
import { Dropdown } from "components/core/dropdown"
import { observer, Observer } from "mobx-react-lite"
import { async } from "validate.js"

export type StartInspectionScreenProps = {

}

export const StartInspectionScreen: React.FC<StartInspectionScreenProps> = observer( ( ) => {
    const navigation = useNavigation()
    const { AuditStore, AuthStore , DashboardStore } = useStores()

    const dashboard = DashboardStore._get( DashboardStore?.currentDashboardId )
    if( isEmpty( dashboard ) ) {
        return null
    }

    useEffect( ( ) => {
        ( async () => {
            await AuditStore.setAnyAuditInProcess( null )
            await AuditStore.setMessage( null )     
        } )();
     
        if( !isEmpty( AuditStore.currentPrimaryListID ) ) {
            // checked for the secondary behalf of 
            if( AuditStore.shouldShowSecondaryList )
            {
                if( AuditStore.currentSecondaryListID ){
                    checkAnyAuditInProcess()
                }
            }else{
                checkAnyAuditInProcess()
            }
        }
        
    }, [ AuditStore.shouldStartInspection,AuditStore.currentPrimaryListID,AuditStore.currentSecondaryListID ] )

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


    const checkAnyAuditInProcess = async ( ) => {
        const payload = {
            UserID: AuthStore.user.UserID,
            AccessToken: AuthStore.token,
            AuditAndInspectionTemplateID: dashboard?.AuditandInspectionTemplateID,
            TypeID: AuditStore.currentPrimaryListID,
            PrimaryUserID: isEmpty( AuditStore.currentSecondaryListID ) ? AuthStore.user.UserID : AuditStore.currentSecondaryListID,
            Type: AuditStore?.audit?.TemplateDetails?.Type,
            // CompanyID: AuthStore.user.CompanyID,
            // CustomFormID: dashboard?.CustomFormID,

        } as IAnyAuditInProcessPayload
        const result = await AuditStore.checkAnyuditInProcess( payload )
        if( result === 'success' ) {
            //  navigation.navigate( 'Inspection' )
        }
    }

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
                            title={dashboard?.Title}
                            // title={AuditStore?.audit?.TemplateDetails?.Title}
                            navigation={navigation}
                        />

                        <Box mt="medium" marginHorizontal="regular">
                            <Text>
                                {`Select ${AuditStore?.audit?.TemplateDetails?.Type} that you want to audit and click start audit button`}
                            </Text> 
                        </Box>
                        { AuditStore.AnyAuditInProcess === "1"
                            ?
                            (  <Box  marginHorizontal="regular" >
                                <Text color="lightRed"  fontWeight="500">
                                    { AuditStore.Message}
                                </Text> 
                            </Box> )
                            : null
                           

                        }
                      
                        <Box flex={AuditStore.shouldShowSecondaryList ? 0.40: 0.28 } height = {40}>
                            <Dropdown
                                title={ `Select ${AuditStore?.audit?.TemplateDetails?.Type}` }
                                isRequired={true}
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
                                            isRequired={true}
                                            value={AuditStore.currentSecondaryListID}
                                            onValueChange={( value )=>AuditStore.setCurrentSecondaryListID( value )}
                                        />
                                    )
                                    : null
                            }
                            <Box mt="mini" justifyContent="flex-end">
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