/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
import "./i18n"
import "./utils/ignore-warnings"
import React, { useState, useRef, useCallback } from "react"
import { NavigationContainerRef } from "@react-navigation/native"
import { SafeAreaView , ActivityIndicator, StyleSheet, TouchableOpacity, Linking, Modal } from "react-native"
import {
    useBackButtonHandler,
    RootNavigator,
    canExit,
    setRootNavigation,
} from "./navigators"
import { RootStore, RootStoreProvider, setupRootStore } from "./models"
import { theme } from "theme"
import codePush from "react-native-code-push"
import { enableScreens } from "react-native-screens"
import { ThemeProvider } from "@shopify/restyle"
import { Async } from "react-async"
import { Box, Text } from "./components"
import Toast from "react-native-simple-toast"
import { checkVersion } from "react-native-check-version";



enableScreens()

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

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
    rootContainer: { backgroundColor: theme.colors.primary, flex: 1 },
    textStyle: {
        color: theme.colors.background,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    }
} )

/**
 * This is the root component of our app.
 */
function App () {
    const navigationRef = useRef<NavigationContainerRef>()
    const [ rootStore, setRootStore ] = useState<RootStore | undefined>( undefined )
    const [ shouldUpdateApplication, setShouldUpdateApplication ] = useState<boolean>( false )

    setRootNavigation( navigationRef )
    useBackButtonHandler( navigationRef, canExit )




    
    const bootstrapApplication = useCallback( async ( ) => {

        try {

            // await codePush.sync()
            const rootStore = await setupRootStore()
            const version = await checkVersion();
            console.log( "Got version info:", version );

            if ( !version.needsUpdate ) {
                console.log( `App has a ${version.updateType} update pending.` );
                setShouldUpdateApplication( true )
            }
            setRootStore( rootStore )
        } catch ( error ) {
            Toast.showWithGravity( error.message || 'Something went wrong while setting up root store', Toast.LONG, Toast.CENTER )
        }
    }, [] )

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
                            <Text style={styles.modalText}>A new update is available. Please download the latest version from Playstore.</Text>
                            <TouchableOpacity
                                style={[ styles.button, styles.buttonOpen ]}
                                onPress = {() => Linking.openURL( "market://details?id=com.wbw" )}
                            >
                                <Text style={styles.textStyle}>Update Application</Text>
                            </TouchableOpacity>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        )
    }

    // otherwise, we're ready to render the app
    return (
        <Async promiseFn={bootstrapApplication}>
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
                        : 
                        <ThemeProvider {...{ theme }}>
                            <RootStoreProvider value={rootStore}>
                                <SafeAreaView style={styles.rootContainer}>
                                    <RootNavigator
                                        ref={navigationRef}
                                    />
                                </SafeAreaView>
                            </RootStoreProvider>
                        </ThemeProvider>
                }
            </Async.Resolved>
        </Async>
    )
}

export default App
