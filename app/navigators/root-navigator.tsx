/**
 * The root navigator is used to switch between major navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow (which is contained in your MainNavigator) which the user
 * will use once logged in.
 */
import React from "react"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { AuthNavigator } from "./auth-navigator"
import { RootNavigationRoutes } from "./navigator-types"
import { Box, Text } from "components"

const { Navigator, Screen } = createStackNavigator<RootNavigationRoutes>()

const screenOptions = { 
    headerShown: false
}
const RootStack = () => {
    return (
        <Box flex={1}>
            <Box flex={0.95}>
                <Navigator screenOptions={screenOptions}>
                    <Screen
                        name="AuthStack"
                        component={AuthNavigator}
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

export const RootNavigator = React.forwardRef<
NavigationContainerRef,
Partial<React.ComponentProps<typeof NavigationContainer>>
>( ( props, ref ) => {
    return (
        <NavigationContainer {...props} ref={ref}>
            <RootStack />
        </NavigationContainer>
    )
} )

RootNavigator.displayName = "RootNavigator"
