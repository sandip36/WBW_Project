import { Box, ObservationHistoryCard, Text } from "components"
import { useStores } from "models"
import React, { useCallback } from "react"
import { Async } from "react-async"
import { ActivityIndicator, FlatList, ViewStyle , StyleProp, RefreshControl } from "react-native"
import { isEmpty } from "lodash"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { FormHeader } from "components/core/header/form-header"
import { makeStyles, useTheme } from "theme"


export type ObservationHistoryScreenProps = {

}

export type ObservationHistoryStyleProps = {
    contentContainerStyle: StyleProp<ViewStyle>
}


const useStyles = makeStyles<ObservationHistoryStyleProps>( ( theme ) => ( {
    contentContainerStyle: {
        paddingBottom: theme.spacing.massive * 2
    }
} ) )

// TODO: stop activity loading in list footer once fetching is completed
export const ObservationHistoryScreen: React.FunctionComponent<ObservationHistoryScreenProps> = observer( ( ) => {
    const { DashboardStore, ObservationStore, AuthStore } = useStores()
    const navigation = useNavigation()
    const theme = useTheme()
    const STYLES = useStyles()
    const dashboard = DashboardStore._get( DashboardStore.currentDashboardId )
    if( isEmpty( dashboard ) ) {
        return null
    }

    const fetchObservationHistory = useCallback( async () => {
        await ObservationStore._clear()
        const payload = {
            UserID: AuthStore.user?.UserID,
            AccessToken: AuthStore.token || AuthStore.user?.AccessToken,
            LevelID: dashboard?.LevelID,
            PageNumber: "1"
        }
        await ObservationStore.fetch( payload )
    }, [] )

    const fetchNextObservationHistory = useCallback( async () => {
        const payload = {
            UserID: AuthStore.user?.UserID,
            AccessToken: AuthStore.token || AuthStore.user?.AccessToken,
            LevelID: dashboard?.LevelID,
            PageNumber: String( ObservationStore.page + 1 )
        }
        await ObservationStore.fetch( payload )
    }, [] )

    const renderItem = ( { item } ) => {
        return (
            <ObservationHistoryCard observation={item} />
        )
    }

    const onRefresh = async ( ) => {
        ObservationStore.setRefreshing()
        fetchObservationHistory()
        ObservationStore.setRefreshing()
    }

    const ListFooterComponent = ( ) => {
        return (
            <ActivityIndicator color={theme.colors.error} size="large" />
        )
    }

    return (
        <Box flex={1}>
            <Async promiseFn={fetchObservationHistory}>
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
                        <Box mt="medium">
                            <FlatList 
                                data={ObservationStore.items.slice()}
                                renderItem={renderItem}
                                onEndReached={fetchNextObservationHistory}
                                onEndReachedThreshold={0.01}
                                ListFooterComponent={ListFooterComponent}
                                refreshControl={
                                    <RefreshControl 
                                        refreshing={ObservationStore.refreshing} 
                                        onRefresh={onRefresh}
                                    />
                                }
                                contentContainerStyle={STYLES.contentContainerStyle}
                                keyExtractor={( item, index ) => String( item.id ) }
                            />
                        </Box>     
                    </Box>
                </Async.Resolved>
            </Async>
        </Box>
    )
} )