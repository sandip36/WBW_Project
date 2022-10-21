import { useFocusEffect, useNavigation } from "@react-navigation/native"
import {  AuditAndInspectionCard, Box, Text } from "components"
import { FormHeader } from "components/core/header/form-header"
import React, { useCallback, useEffect, useState } from "react"
import { Async } from "react-async"
import { Avatar, Icon, SearchBar } from "react-native-elements"
import { ActivityIndicator, FlatList, ViewStyle, StyleProp } from "react-native"
import { makeStyles, theme } from "theme"
import { useStores } from "models"
import { isEmpty } from "lodash"
import { IAuditHistoryFetchPayload } from "services/api"
import { observer } from "mobx-react-lite"

export type AuditAndInspectionScreenProps = {

}

export type AuditAndInspectionHistoryStyleProps = {
    contentContainerStyle: StyleProp<ViewStyle>,
    avatarContainerStyle: StyleProp<ViewStyle>
    searchBarContainerStyle :StyleProp<ViewStyle>
}

const useStyles = makeStyles<AuditAndInspectionHistoryStyleProps>( ( theme ) => ( {
    contentContainerStyle: {
        paddingBottom: theme.spacing.massive *4
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

export const AuditAndInspectionScreen: React.FunctionComponent<AuditAndInspectionScreenProps> = observer( ( props ) => {
    const navigation = useNavigation()
    const STYLES = useStyles()
    const { DashboardStore, AuditStore, AuthStore } = useStores()
    const [ showLoading,setShowLoading ] = useState( true )
    const [ callbaseSevice, setCallbaseSevice ] = useState( true )
    const [ searchedValue, setSearchedValue ] = useState<string>( '' )



    const dashboard = DashboardStore._get( DashboardStore?.currentDashboardId )
    if( isEmpty( dashboard ) ) {
        return null
    }
    useEffect( ( ) => {
        AuditStore.setSearchTextTemp( "" )

    }, [] )
    useFocusEffect(
        React.useCallback( () => {
            fetchAuditAndInspectionHistory()
        }, [ callbaseSevice ] )
    );
    
    const fetchAuditAndInspectionHistory = useCallback( async () => {
        setShowLoading( true )
        await AuditStore.reset()
        const payload = {
            UserID: AuthStore?.user.UserID,
            AccessToken: AuthStore?.token,
            CustomFormID: dashboard?.CustomFormID,
            AuditAndInspectionTemplateID: dashboard?.AuditandInspectionTemplateID,
            PageNumber: "1",
            SearchText:AuditStore.searchTextTemp
            
        } as IAuditHistoryFetchPayload
        await AuditStore.fetch( payload )
        setShowLoading( false )
    }, [] )

    const fetchNextAuditAndInspectionHistory = useCallback( async () => {
        const payload = {
            UserID: AuthStore?.user.UserID,
            AccessToken: AuthStore?.token,
            CustomFormID: dashboard?.CustomFormID,
            AuditAndInspectionTemplateID: dashboard?.AuditandInspectionTemplateID,
            PageNumber: String( AuditStore.page + 1 ),
            SearchText:AuditStore.searchTextTemp
        } as IAuditHistoryFetchPayload
        await AuditStore.fetch( payload )
    }, [] )

    // const onRefresh = async ( ) => {
    //     await AuditStore.setRefreshing()
    //     fetchAuditAndInspectionHistory()
    //     await AuditStore.setRefreshing()
    // }

    const navigateToStartInspection = ( ) => {
        navigation.navigate( 'StartInspection' )
    }

    const renderItem = ( { item } ) => {
        return (
            <AuditAndInspectionCard auditAndInspectionDetails={item} />
        )
    }



    useEffect( () => {
      
        const delayDebounceFn = setTimeout( async () => {
            if( searchedValue.length >2 ){
                await AuditStore.reset()

                const payload = {
                    UserID: AuthStore?.user.UserID,
                    AccessToken: AuthStore?.token,
                    CustomFormID: dashboard?.CustomFormID,
                    AuditAndInspectionTemplateID: dashboard?.AuditandInspectionTemplateID,
                    PageNumber: "1",
                    SearchText:AuditStore.searchTextTemp
                    
                } as IAuditHistoryFetchPayload
                await AuditStore.fetch( payload )
                setShowLoading( false )
            }
        }, 600 )
    
        return () => clearTimeout( delayDebounceFn )
    }, [ searchedValue ] )
    


    const searchFilterFunction = async ( text ) => {   
        AuditStore.setSearchTextTemp( text )
        setSearchedValue( text )

        if (  text.length >2 ) {
            setShowLoading( true )             
          
        } else {
            AuditStore.setSearchTextTemp( text )
            if( text.length <1 ){
                await AuditStore.setSearchTextTemp( "" )
                setCallbaseSevice( !callbaseSevice )
            }
        }
    };
    const onClearclick= async ()=>{
        await AuditStore.setSearchTextTemp( "" )
        setCallbaseSevice( !callbaseSevice )
    
    }




    return (
        <Box flex={1}>
            <Async promiseFn={fetchAuditAndInspectionHistory} watch={AuditStore.rerender}>
                <Async.Pending>
                    { ( ) => (
                        <Box position="absolute" top={0} left={0} right={0} bottom={0} alignItems="center" justifyContent="center">
                            <ActivityIndicator  animating={showLoading} size={32} color="red" />
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

                        <Box position="absolute" top={0} left={0} right={0} bottom={0} alignItems="center" justifyContent="center">
                            <ActivityIndicator  animating={showLoading} size={32} color="red" />
                        </Box>
                        {/* <Box position="absolute" top={0} left={0} right={0} bottom={0} alignItems="center" justifyContent="center">
                            <Text
                                color={"lightRed"}
                            
                            >No record found</Text>

                        </Box> */}
                        <FormHeader 
                            title={dashboard?.Title}
                            navigation={navigation}
                        />
                      
                    
                        <Box >
                           
                            <Box>
                                <Box >
                                    <SearchBar
                                        placeholder="Type Here..."
                                        platform="default"
                                        inputStyle={{ color:theme.colors.primary }}
                                        containerStyle={STYLES.searchBarContainerStyle}
                                        inputContainerStyle={{ backgroundColor: 'white' }}
                                        value={searchedValue}
                                        cancelIcon={true}
                                        showCancel={true}
                                        onClear={onClearclick}
                                        onChangeText={( text ) => searchFilterFunction( text )}
                                    />
                                </Box>
                            </Box>

                            <Box>
                                <FlatList 
                                    data={AuditStore.auditAndInspectionDetails}
                                    renderItem={renderItem}
                                    onEndReached={fetchNextAuditAndInspectionHistory}
                                    onEndReachedThreshold={0.01}
                                    // refreshControl={
                                    // //     <RefreshControl 
                                    // //         refreshing={AuditStore.refreshing} 
                                    // //         onRefresh={onRefresh}
                                    // //     />
                                    // }
                                    contentContainerStyle={STYLES.contentContainerStyle}
                                    keyExtractor={( item, index ) => String( item.AuditAndInspectionID ) }
                                />

                            </Box>
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