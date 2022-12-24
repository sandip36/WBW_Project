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
import React, { useState, useRef, useCallback, useEffect } from "react"
import { NavigationContainerRef } from "@react-navigation/native"
import { SafeAreaView , ActivityIndicator, StyleSheet, Platform, Alert } from "react-native"
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
import PushNotications from "react-native-push-notification"
import * as storage from "./utils/storage"


import { ThemeProvider } from "@shopify/restyle"
import { Async } from "react-async"
import { Box, Text } from "./components"
import Toast from "react-native-simple-toast"
import CheckConnection from "screens/sampleFolder/ConnectivityChecker"
// import ForegroundHandler from "screens/firbaseConfiguration/ForegroundHandler"
import { requestUserPermission, notificationListener } from './screens/firbaseConfiguration/notificationhandler';
import ForegroundHandler from "screens/firbaseConfiguration/ForegroundHandler"

enableScreens()
requestUserPermission()
notificationListener()

// useEffect( () => {
//    

//    
// }, [] )

// // ForegroundHandler()
// PushNotications.configure( {
    

//     // (optional) Called when Token is generated (iOS and Android)
//     onRegister: async ( token: { token: string } ) => {
//         if ( __DEV__ ) console.log( 'TOKEN:', token )
//         await storage.saveString( 'TOKEN', token.token )          
//     },

//     // (required) Called when a remote or local notification is opened or received
//     // onNotification: ( notification ) => {
//     //  dispatch( NotificationActions.addNotification( notification.message ) )
//     // },

//     // ANDROID ONLY: (optional) GCM Sender ID.
//     senderID: '399465061043',

//     // IOS ONLY (optional): default: all - Permissions to register.
//     permissions: {
//         alert: true,
//         badge: true,
//         sound: true
//     },

//     // Should the initial notification be popped automatically
//     // default: true
//     // Leave this off unless you have good reason.
//     popInitialNotification: true,

//     /**
//       * IOS ONLY: (optional) default: true
//       * - Specified if permissions will requested or not,
//       * - if not, you must call PushNotificationsHandler.requestPermissions() later
//       * This example app shows how to best call requestPermissions() later.
//       */
//     requestPermissions: true
// } )

// PushNotications.configure( {
//     // ! TODO - onRegister method not being called

//     onRegister: async function ( token ) {
//         console.log( "token for  device ",token )
//         // await storage.saveString( 'TOKEN', token.token )
//     },
//     popInitialNotification: true,
//     requestPermissions: Platform.OS === 'ios'
// } )

PushNotications.createChannel(
    {
        channelId: "default",
        channelName: "notification-wbw",
        channelDescription: "A channel to categorise your notifications",
        playSound: false,
        soundName: "default",
        importance: 4,
        vibrate: true,
    }
)


export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

const styles = StyleSheet.create( {
    rootContainer: { backgroundColor: theme.colors.primary, flex: 1 }
} )

/**
 * This is the root component of our app.
 */
function App () {
    const navigationRef = useRef<NavigationContainerRef>()
    const [ rootStore, setRootStore ] = useState<RootStore | undefined>( undefined )

    setRootNavigation( navigationRef )
    useBackButtonHandler( navigationRef, canExit )
 
    const bootstrapApplication = useCallback( async ( ) => {

        try {

            // await codePush.sync()
            const rootStore = await setupRootStore()
            setRootStore( rootStore )
        } catch ( error ) {
            Toast.showWithGravity( error.message || 'Something went wrong while setting up root store', Toast.LONG, Toast.CENTER )
        }
    }, [] )

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
                <ThemeProvider {...{ theme }}>
                    <RootStoreProvider value={rootStore}>
                        <SafeAreaView style={styles.rootContainer}>
                            <ForegroundHandler></ForegroundHandler>
                            <RootNavigator
                                ref={navigationRef}
                            />
                        </SafeAreaView>
                    </RootStoreProvider>
                </ThemeProvider>
            </Async.Resolved>
        </Async>
    )
}

export default App
