/**
 * This is the navigator you will modify to display the application screens of your app.
 *
 */
import React, { Fragment } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "react-native"
import { ApplicationNavigationRoutes } from "./navigator-types"
import { DashboardHomeScreen, ObservationHistoryScreen } from "screens"
   
const { Navigator, Screen } = createStackNavigator<ApplicationNavigationRoutes>()
  
export const ApplicationNavigator = ( ) => {
    return (
        <Fragment>
            <StatusBar backgroundColor="transparent" barStyle="light-content" />
            <Navigator headerMode="none" initialRouteName="Home">
                <Screen name="Home" component={DashboardHomeScreen} />
                <Screen name="ObservationHistory" component={ObservationHistoryScreen} />
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
  