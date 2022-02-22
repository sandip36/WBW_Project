import { useFocusEffect, useNavigation } from "@react-navigation/native"
import {  AuditAndInspectionCard, Box, Text } from "components"
import { FormHeader } from "components/core/header/form-header"
import React, { useCallback, useEffect, useState } from "react"
import { Async } from "react-async"
import { Avatar } from "react-native-elements"
import { ActivityIndicator, FlatList, ViewStyle, StyleProp, RefreshControl } from "react-native"
import { makeStyles, theme } from "theme"
import { useStores } from "models"
import { isEmpty } from "lodash"
import { IAuditHistoryFetchPayload } from "services/api"
import { observer } from "mobx-react-lite"
import { reset } from "utils/keychain"

export type AuditAndInspectionScreenProps = {

}

export type AuditAndInspectionHistoryStyleProps = {
    contentContainerStyle: StyleProp<ViewStyle>,
    avatarContainerStyle: StyleProp<ViewStyle>
}

const useStyles = makeStyles<AuditAndInspectionHistoryStyleProps>( ( theme ) => ( {
    contentContainerStyle: {
        paddingBottom: theme.spacing.massive * 2
    },
    avatarContainerStyle: {
        backgroundColor: theme.colors.primary
    }
} ) )

export const AuditAndInspectionScreen: React.FunctionComponent<AuditAndInspectionScreenProps> = observer( ( props ) => {
    const navigation = useNavigation()
    const STYLES = useStyles()
    const { DashboardStore, AuditStore, AuthStore } = useStores()
    const dashboard = DashboardStore._get( DashboardStore?.currentDashboardId )
    if( isEmpty( dashboard ) ) {
        return null
    }

    useFocusEffect(
        React.useCallback( () => {
            fetchAuditAndInspectionHistory()
        }, [] )
    );
    
    const fetchAuditAndInspectionHistory = useCallback( async () => {
        await AuditStore.reset()
        const payload = {
            UserID: AuthStore?.user.UserID,
            AccessToken: AuthStore?.token,
            CustomFormID: dashboard?.CustomFormID,
            AuditAndInspectionTemplateID: dashboard?.AuditandInspectionTemplateID,
            PageNumber: "1"
        } as IAuditHistoryFetchPayload
        await AuditStore.fetch( payload )
    }, [] )

    const fetchNextAuditAndInspectionHistory = useCallback( async () => {
        const payload = {
            UserID: AuthStore?.user.UserID,
            AccessToken: AuthStore?.token,
            CustomFormID: dashboard?.CustomFormID,
            AuditAndInspectionTemplateID: dashboard?.AuditandInspectionTemplateID,
            PageNumber: String( AuditStore.page + 1 )
        } as IAuditHistoryFetchPayload
        await AuditStore.fetch( payload )
    }, [] )

    const onRefresh = async ( ) => {
        await AuditStore.setRefreshing()
        fetchAuditAndInspectionHistory()
        await AuditStore.setRefreshing()
    }

    const navigateToStartInspection = ( ) => {
        navigation.navigate( 'StartInspection' )
    }

    const renderItem = ( { item } ) => {
        return (
            <AuditAndInspectionCard auditAndInspectionDetails={item} />
        )
    }

    return (
        <Box flex={1}>
            <Async promiseFn={fetchAuditAndInspectionHistory} watch={AuditStore.rerender}>
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
                            title={dashboard?.Category}
                            navigation={navigation}
                        />
                        <Box mt="regular">
                            <FlatList 
                                data={AuditStore.auditAndInspectionDetails}
                                renderItem={renderItem}
                                onEndReached={fetchNextAuditAndInspectionHistory}
                                onEndReachedThreshold={0.01}
                                refreshControl={
                                    <RefreshControl 
                                        refreshing={AuditStore.refreshing} 
                                        onRefresh={onRefresh}
                                    />
                                }
                                contentContainerStyle={STYLES.contentContainerStyle}
                                keyExtractor={( item, index ) => String( item.AuditAndInspectionID ) }
                            />
                        </Box>
                        <Box position="absolute" bottom={20} right={10}>
                            <Avatar size="medium" onPress={navigateToStartInspection} rounded icon={{ name: 'add' }} containerStyle={STYLES.avatarContainerStyle}/>
                        </Box>
                    </Box>
                </Async.Resolved>
            </Async>
        </Box>
    )
} )