import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { Box, Header, Text, TouchableBox } from "components"
import { DashboardCard } from "components/dashboard"
import { MediaStore, useStores } from "models"
import React, { useCallback, useEffect, useState } from "react"
import { Async } from "react-async"
import { ActivityIndicator, Alert, FlatList, Linking, Modal, StyleSheet, TouchableOpacity } from "react-native"
import { checkVersion } from "react-native-check-version"
import { theme } from "theme"

export type DashboardHomeScreenProps = {

}

const styles = StyleSheet.create( {
    button: {
        borderRadius: 20,
        elevation: 2,
        padding: 10
    },
    buttonOpen: { 
        backgroundColor : theme.colors.primary, 
        borderColor : theme.colors.black, 
        borderRadius : 5, 
        borderWidth : 1 ,
        marginTop : 25 
    },
    centeredView: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    modalText: {
        fontSize: 18,
        marginBottom: 15,
        textAlign: "center",
    },
    modalView: {
        alignItems: "center",
        backgroundColor: theme.colors.background,
        borderRadius: 20,
        elevation: 5,
        margin: 20,
        padding: 35,
        shadowColor: theme.colors.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        width: "80%"
    },
    textStyle: {
        color: theme.colors.background,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    }
} )

export const DashboardHomeScreen: React.FunctionComponent<DashboardHomeScreenProps> = ( ) => {
    const { DashboardStore, AuthStore, ObservationStore, AuditStore,MediaStore } = useStores()
    const [ shouldUpdateApplication, setShouldUpdateApplication ] = useState<boolean>( false )
    const navigation = useNavigation()
    const [ infoVersion,setInfoVersion ]= useState<any>( {} )


    const fetchDashboard = useCallback( async () => {
        await ObservationStore._clear()
        await AuditStore.resetStore()
        await MediaStore._clear()
        await DashboardStore.fetch()
    //     const version = await checkVersion();
    //     setInfoVersion( version )
    //   //  console.log( `App has a ${version} update pending.`,JSON.stringify( version ) );
    //     if ( version.needsUpdate && AuthStore.user.skipCount < 3 && AuthStore.user.shouldShowUpdateModal() ) {
    //         console.log( `App has a ${version.updateType} update pending.` );
    //         setShouldUpdateApplication( true )
    //         // await ObservationStore._clear()
    //         // await AuditStore.resetStore()
    //         // await MediaStore._clear()
    //         // await DashboardStore.fetch()
    //     }else{
    //         await ObservationStore._clear()
    //         await AuditStore.resetStore()
    //         await MediaStore._clear()
    //         await DashboardStore.fetch()
    //     }
    }, [] )




    useFocusEffect(
        React.useCallback( () => {
            ( async () => {
                await MediaStore._clear()
            } )();
        }, [] )
    );



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

    const onLeftIconPress = ( ) => {
        navigation.navigate( 'MediaList' )
    }

    const skipUpdate = async ( ) => {
        await AuthStore.user.updateSkipCount()
        await AuthStore.user.setSkippedDate()
        setShouldUpdateApplication( false )
    }

    const updateDialogbox = ( ) => {
        return(
            <Box style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={true}
                >
                    <Box style={styles.centeredView}>
                        <Box style={styles.modalView}>
                            <Text style={styles.modalText}>Update is available. Please download the latest version.</Text>
                            <TouchableOpacity
                                style={[ styles.button, styles.buttonOpen ]}
                                onPress = {() => Linking.openURL( infoVersion?.url )}
                            >
                                <Text style={styles.textStyle}>Update</Text>
                            </TouchableOpacity>
                            <TouchableBox justifyContent="center" marginTop="large" alignItems="center" onPress={skipUpdate}>
                                <Text textAlign="center" fontSize={theme.spacing.regular * 1.2}>
                                Not Now
                                </Text>
                            </TouchableBox>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        )
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
                    {
                        shouldUpdateApplication
                            ? updateDialogbox()
                            :  <Box flex={1}>
                                <Header
                                    //  leftComponent={{ icon: 'video-library', color: '#fff', type: 'material', onPress: onLeftIconPress, style: { marginHorizontal: theme.spacing.small } }} 
                                    title={AuthStore.user?.CompanyName}
                                    rightComponent={{ icon: 'logout', color: '#fff', type: 'material', onPress: onRightIconPress, style: { marginHorizontal: theme.spacing.small } }}
                                />
                                <Box mt="small">
                                    <FlatList 
                                        data={DashboardStore.sortDashboardByPageOrder}
                                        renderItem={renderItem}
                                        keyExtractor={( item, index ) => item.id }
                                        contentContainerStyle={{ paddingBottom: 100 }}
                                    />
                                </Box>     
                            </Box>
                    }
                </Async.Resolved>
            </Async>
        </Box>
    )
}