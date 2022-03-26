import { Box, Header, Text } from "components"
import { DashboardCard } from "components/dashboard"
import { useStores } from "models"
import React, { useCallback } from "react"
import { Async } from "react-async"
import { ActivityIndicator, Alert, FlatList } from "react-native"
import { theme } from "theme"

export type DashboardHomeScreenProps = {

}

export const DashboardHomeScreen: React.FunctionComponent<DashboardHomeScreenProps> = ( ) => {
    const { DashboardStore, AuthStore, ObservationStore, AuditStore } = useStores()

    const fetchDashboard = useCallback( async () => {
        await ObservationStore._clear()
        await AuditStore.resetStore()
        await DashboardStore.fetch()
    }, [] )

    const renderItem = ( { item } ) => {
        return (
            <DashboardCard dashboard={item} />
        )
    }

    const onRightIconPress = ( ) => {
        Alert.alert(
            "Logout?",
            "Are you sure you want to logout?",
            [
                {
                    text: "No",
                    onPress: () => null
                },
                {
                    text: "Yes",
                    onPress: ( ) => AuthStore.logout()
                }
            ],
        );
        return true
    }

    return (
        <Box flex={1}>
            <Async promiseFn={fetchDashboard}>
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
                        <Header 
                            title={AuthStore.user?.CompanyName}
                            rightComponent={{ icon: 'logout', color: '#fff', type: 'material', onPress: onRightIconPress, style: { marginHorizontal: theme.spacing.small } }}
                        />
                        <Box mt="small">
                            <FlatList 
                                data={DashboardStore.sortDashboardByPageOrder}
                                renderItem={renderItem}
                                keyExtractor={( item, index ) => item.id }
                            />
                        </Box>     
                    </Box>
                </Async.Resolved>
            </Async>
        </Box>
    )
}