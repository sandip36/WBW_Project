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

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * We recommend using MobX-State-Tree store(s) to handle state rather than navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */


const Stack = createStackNavigator<RootNavigationRoutes>()

const RootStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="AuthStack"
                component={AuthNavigator}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
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
