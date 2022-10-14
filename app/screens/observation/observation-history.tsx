import { Box, ObservationHistoryCard, Text } from "components"
import { useStores } from "models"
import React, { useCallback, useEffect, useState } from "react"
import { Async } from "react-async"
import { ActivityIndicator, FlatList, ViewStyle , StyleProp, RefreshControl } from "react-native"
import { isEmpty } from "lodash"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { FormHeader } from "components/core/header/form-header"
import { makeStyles, useTheme } from "theme"
import { Avatar, SearchBar } from "react-native-elements"


export type ObservationHistoryScreenProps = {

}

export type ObservationHistoryStyleProps = {
    contentContainerStyle: StyleProp<ViewStyle>,
    avatarContainerStyle: StyleProp<ViewStyle>,
    searchBarContainerStyle:StyleProp<ViewStyle>
}


const useStyles = makeStyles<ObservationHistoryStyleProps>( ( theme ) => ( {
    contentContainerStyle: {
        paddingBottom: theme.spacing.massive * 4
    },
    avatarContainerStyle: {
        backgroundColor: theme.colors.primary
    }, searchBarContainerStyle: {
        backgroundColor: theme.colors.primary,
        margin: 0,
        padding: 10,
        borderBottomColor: theme.colors.transparent,
        borderTopColor: theme.colors.transparent
    },
} ) )

// TODO: stop activity loading in list footer once fetching is completed
export const ObservationHistoryScreen: React.FunctionComponent<ObservationHistoryScreenProps> = observer( ( ) => {
    const { DashboardStore, ObservationStore, AuthStore } = useStores()
    const [ showLoading,setShowLoading ] = useState( true )
    const navigation = useNavigation()
    const STYLES = useStyles()
    let onEndReachedCalledDuringMomentum = false
    const dashboard = DashboardStore._get( DashboardStore.currentDashboardId )
    const [ callbaseSevice, setCallbaseSevice ] = useState( true )
    const [ searchedValue, setSearchedValue ] = useState<string>( '' )


    if( isEmpty( dashboard ) ) {
        return null
    }
    useEffect( ( ) => {
        ObservationStore.setSearchTextTemp( "" )

    }, [] )


    useFocusEffect(
        React.useCallback( () => {
            fetchObservationHistory()
        }, [ callbaseSevice ] )
    );

    const fetchObservationHistory = useCallback( async () => {
        await ObservationStore.clearStore()

        setShowLoading( true )
        const payload = {
            UserID: AuthStore.user?.UserID,
            AccessToken: AuthStore.token || AuthStore.user?.AccessToken,
            LevelID: dashboard?.LevelID,
            PageNumber: "1",
            SearchText :ObservationStore.searchTextTemp
        }
        await ObservationStore.fetch( payload )
        setShowLoading( false )
    }, [] )

    const fetchNextObservationHistory = useCallback( async () => {
        if( ObservationStore.isComplete ) {
            setShowLoading( false )
            return null
        }
        await ObservationStore.setRefreshing()
        setShowLoading( true )

        const payload = {
            UserID: AuthStore.user?.UserID,
            AccessToken: AuthStore.token || AuthStore.user?.AccessToken,
            LevelID: dashboard?.LevelID,
            PageNumber: String( ObservationStore.page + 1 ),
            SearchText :ObservationStore.searchTextTemp
        }
        await ObservationStore.fetch( payload )
        await ObservationStore.setRefreshing()
        setShowLoading( false )
    }, [] )

    const renderItem = ( { item } ) => {
        return (
            <ObservationHistoryCard observation={item} />
        )
    }
   
    // const onRefresh  = async ( ) => {
    //     // ObservationStore.setRefreshing()
    //     // fetchObservationHistory()
    //     // ObservationStore.setRefreshing()
    // }


    const navigateToAddObservation = ( ) => {
        ObservationStore.resetEditStore()
        navigation.navigate( 'AddObservation' )
    }



    const searchFilterFunction = async ( text ) => {
        // Check if searched text is not blank
           
        if ( ( text ).length >2 ) {
            setShowLoading( true )
            await ObservationStore.setSearchTextTemp( text )
            await ObservationStore.clearStore()
            const payload = {
                UserID: AuthStore.user?.UserID,
                AccessToken: AuthStore.token || AuthStore.user?.AccessToken,
                LevelID: dashboard?.LevelID,
                PageNumber: "1",
                SearchText :text
            }
            await ObservationStore.fetch( payload )
            setShowLoading( false )
          
        } else {
            if( text.length <1 ){
                await ObservationStore.setSearchTextTemp( "" )
                setCallbaseSevice( !callbaseSevice )
            }
        }
        setSearchedValue( text )
        setShowLoading( false )
    };
    const onClearclick= async ()=>{
        await ObservationStore.setSearchTextTemp( "" )
        setCallbaseSevice( !callbaseSevice )
    
    }

    return (
        <Async promiseFn={fetchObservationHistory}>
            <Async.Pending>
                { ( ) => (
                    <Box position="absolute" top={0} left={0} right={0} bottom={0} alignItems="center" justifyContent="center">
                        <ActivityIndicator animating={showLoading} size={32} color="red" />
                    </Box>
                ) }
            </Async.Pending>
            <Async.Rejected>
                { 
                    ( error: any ) => {
                        setShowLoading( false ) 
                        return (
                            <Box justifyContent="center" alignItems="center" flex={1}>
                                <Text>{error.reason || error.message || 'Something went wrong'}</Text>
                            </Box>
                        ) }
                }
            </Async.Rejected>
            <Async.Resolved>
                <Box flex={1}>
                    <Box position="absolute" top={0} left={0} right={0} bottom={0} alignItems="center" justifyContent="center">
                        <ActivityIndicator  animating={showLoading} size={32} color="red" />
                    </Box>
                    <FormHeader 
                        title={dashboard?.Category}
                        navigation={navigation}
                    />
                    <Box>
                        <Box >
                            <SearchBar
                                placeholder="Type Here..."
                                platform="default"
                                containerStyle={STYLES.searchBarContainerStyle}
                                value={searchedValue}
                                cancelIcon={true}
                                showCancel={true}
                                onClear={onClearclick}
                                onChangeText={( text ) => searchFilterFunction( text )}
                            />
                        </Box>
                    </Box>
                    <Box mt="medium">
                        <FlatList 
                            data={ObservationStore.items.slice()}
                            renderItem={renderItem}
                            onEndReached={()=>{
                                if ( !onEndReachedCalledDuringMomentum ) {
                                    fetchNextObservationHistory();    // LOAD MORE DATA
                                    onEndReachedCalledDuringMomentum = true;
                                }
                            }}
                            onEndReachedThreshold={0.01}
                            onMomentumScrollBegin = {() => {onEndReachedCalledDuringMomentum = false;}}
                            // refreshControl={
                            //     // <RefreshControl 
                            //     //     refreshing={ObservationStore.refreshing} 
                            //     //     onRefresh={onRefresh}
                            //     // />
                            // }
                            contentContainerStyle={STYLES.contentContainerStyle}
                            keyExtractor={( item, index ) => String( item.id ) }
                        />
                    </Box>
                    <Box position="absolute" bottom={20} right={10}>
                        <Avatar size="medium" onPress={navigateToAddObservation} rounded icon={{ name: 'add' }} containerStyle={STYLES.avatarContainerStyle}/>
                    </Box>
                </Box>
            </Async.Resolved>
        </Async>
    )
} )