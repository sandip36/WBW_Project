/**
 * The root navigator is used to switch between major navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow (which is contained in your MainNavigator) which the user
 * will use once logged in.
 */
import React, { useCallback } from "react"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { AuthNavigator } from "./auth-navigator"
import { RootNavigationRoutes } from "./navigator-types"
import { Box, Text } from "components"
import { Async } from "react-async"
import { ApplicationNavigator } from "./application-navigator"
import { ActivityIndicator } from "react-native"
import { observer } from "mobx-react-lite"
import{ isEmpty } from "lodash"
import { useStores } from "models"

const { Navigator, Screen } = createStackNavigator<RootNavigationRoutes>()

const screenOptions = { 
    headerShown: false
}
const RootStack = observer( () => {
    const { AuthStore, DashboardStore } = useStores()
    const bootstrap = useCallback( async () => {
        const response = await DashboardStore.fetch()
        return response
    }, [ AuthStore.user, AuthStore.token ] )

    return (
        <Async promiseFn={bootstrap} watch={AuthStore.user}>
            <Async.Pending>
                { ( ) => (
                    <Box position="absolute" top={0} left={0} right={0} bottom={0} alignItems="center" justifyContent="center">
                        <ActivityIndicator size={32} color="red" />
                    </Box>
                ) }
            </Async.Pending>
            <Async.Rejected>
                <Navigator screenOptions={screenOptions}>
                    <Screen
                        name="AuthStack"
                        component={AuthNavigator}
                        options={screenOptions}
                    />
                </Navigator>
            </Async.Rejected>
            <Async.Resolved>
                {
                    ( response: any ) => (
                        isEmpty( response )
                            ? <AuthNavigator />
                            : <Box flex={1}>
                                <Box flex={0.95} bg="white">
                                    <Navigator screenOptions={screenOptions}>
                                        <Screen
                                            name="ApplicationStack"
                                            component={ApplicationNavigator}
                                            options={screenOptions}
                                        />
                                    </Navigator>
                                </Box>
                                <Box flex={0.05} bg="primary" justifyContent="center" alignItems="center">
                                    <Text color="white">Copyright © Wise Businessware. All rights reserved.</Text>
                                </Box>
                            </Box>
                    )
                }
            </Async.Resolved>
        </Async>
    )
} )

export const RootNavigator = observer<
Partial<React.ComponentProps<typeof NavigationContainer>>,
NavigationContainerRef
>( ( props, ref ) => {
    return (
        <NavigationContainer {...props} ref={ref}>
            <RootStack />
        </NavigationContainer>
    )
}, { forwardRef: true } )

RootNavigator.displayName = "RootNavigator"
