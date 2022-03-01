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
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context"
import { SafeAreaView , ActivityIndicator, StyleSheet } from "react-native"
import * as storage from "./utils/storage"
import {
    useBackButtonHandler,
    RootNavigator,
    canExit,
    setRootNavigation,
    useNavigationPersistence,
} from "./navigators"
import { RootStore, RootStoreProvider, setupRootStore } from "./models"
import { theme } from "theme"
import codePush from "react-native-code-push"


// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator
import { enableScreens } from "react-native-screens"
import { ThemeProvider } from "@shopify/restyle"
import { Async } from "react-async"
import { Box, Text } from "./components"
import Toast from "react-native-simple-toast"

enableScreens()

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
            
            await codePush.sync()

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
                        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                            <SafeAreaView style={styles.rootContainer}>
                                <RootNavigator
                                    ref={navigationRef}
                                />
                            </SafeAreaView>
                        </SafeAreaProvider>
                    </RootStoreProvider>
                </ThemeProvider>
            </Async.Resolved>
        </Async>
    )
}

export default App
