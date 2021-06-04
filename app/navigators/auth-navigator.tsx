/**
 * This is the navigator you will modify to display the auth screens of your app.
 * You can use RootNavigator to also display an logged-in flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React, { Fragment } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "react-native"
import { AuthNavigationRoutes } from "./navigator-types"
import { LoginScreen } from "screens"
  
const { Navigator, Screen } = createStackNavigator<AuthNavigationRoutes>()
 
export const AuthNavigator = ( ) => {
    return (
        <Fragment>
            <StatusBar backgroundColor="transparent" barStyle="light-content" />
            <Navigator headerMode="none" initialRouteName="Login">
                <Screen name="Login" component={LoginScreen} />
            </Navigator>
        </Fragment>
    )
}
 
/**
  * A list of routes from which we're allowed to leave the app when
  * the user presses the back button on Android.
  *
  * Anything not on this list will be a standard `back` action in
  * react-navigation.
  *
  * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
  */
const exitRoutes = [ "Login" ]
export const canExit = ( routeName: string ) => exitRoutes.includes( routeName )
 