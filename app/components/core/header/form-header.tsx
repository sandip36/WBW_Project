import { StackActions } from "@react-navigation/native"
import React, { FunctionComponent } from "react"
import { StyleProp, TextStyle, ViewStyle } from "react-native"
import { Header as RNEHeader } from "react-native-elements"
import { makeStyles, useTheme } from "theme"

const useStyles = makeStyles<{containerStyle: StyleProp<ViewStyle>, centerStyle: StyleProp<TextStyle>, leftContainerStyle: StyleProp<ViewStyle> }>( ( theme ) => ( {
    containerStyle: {
        paddingTop: theme.spacing.small - 4,
        height: 48 + theme.STATUS_BAR_HEIGHT,
    },
    centerStyle: {
        color: theme.colors.white,
        fontSize: theme.spacing.large,
        fontWeight: 'bold'
    },
    leftContainerStyle: {
        marginTop: theme.spacing.mini,
        paddingLeft: theme.spacing.mini
    }
} ) )

export type HeaderProps = {
    title: string,
    containerStyle?: StyleProp<ViewStyle>,
    centerStyle?: StyleProp<TextStyle>,
    rightComponent?: any;
    navigation: any,
    leftContainerStyle?: StyleProp<ViewStyle>,
    rightContainerStyle?: StyleProp<ViewStyle>,
    customBackHandler?: ( ) => void
}

export const FormHeader: FunctionComponent<HeaderProps> = props => {
    const {
        title,
        containerStyle,
        centerStyle,
        rightComponent,
        navigation,
        leftContainerStyle,
        rightContainerStyle,
        customBackHandler
    } = props
    const STYLES = useStyles()
    const theme = useTheme()
    const navigateToGoBack = ( ) => {
        navigation.dispatch( StackActions.pop( 1 ) )

        // navigation.goBack()
    }
    const backHandler = customBackHandler || navigateToGoBack
    return (
        <RNEHeader
            statusBarProps={{ barStyle: "light-content", translucent: true, backgroundColor: "transparent" }}
            leftComponent={{ icon: 'arrow-left', type: 'material-community', color: theme.colors.black, onPress: backHandler }}
            leftContainerStyle={[ STYLES.leftContainerStyle, leftContainerStyle ]}
            centerComponent={{ text: title, style: [ STYLES.centerStyle, centerStyle ] }}
            rightComponent={rightComponent}
            rightContainerStyle={[ STYLES.leftContainerStyle, rightContainerStyle ]}
            backgroundColor={theme.colors.primary}
            containerStyle={[ STYLES.containerStyle, containerStyle ]}
        />
    )
}
