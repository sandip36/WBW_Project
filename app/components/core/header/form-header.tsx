import { StackActions } from "@react-navigation/native"
import React, { FunctionComponent } from "react"
import { Platform, StyleProp, TextStyle, ViewStyle } from "react-native"
import { Header as RNEHeader } from "react-native-elements"
import { makeStyles, useTheme } from "theme"
import { Box } from "../box"

const useStyles = makeStyles<{containerStyle: StyleProp<ViewStyle>, centerStyle: StyleProp<TextStyle>, leftContainerStyle: StyleProp<ViewStyle> }>( ( theme ) => ( {
    containerStyle: {
        paddingTop: theme.spacing.small - 4,
        height: Platform.OS==="ios"? theme.STATUS_BAR_HEIGHT : 48+ theme.STATUS_BAR_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center'
    },
    centerStyle: {
        color: theme.colors.white,
        fontSize: theme.spacing.large,
        fontWeight: 'bold',
        marginTop: theme.spacing.mini
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
        <Box justifyContent="center" alignItems="center">
            <RNEHeader
                statusBarProps={{ barStyle: "light-content", translucent: true, backgroundColor: "transparent" }}
                leftComponent={{ icon: 'arrow-left', type: 'material-community', color: theme.colors.white, onPress: backHandler }}
                leftContainerStyle={[ STYLES.leftContainerStyle, leftContainerStyle ]}
                centerComponent={{ text: title, style: [ STYLES.centerStyle, centerStyle ] }}
                rightComponent={rightComponent}
                rightContainerStyle={[ STYLES.leftContainerStyle, rightContainerStyle ]}
                backgroundColor={theme.colors.primary}
                containerStyle={[ STYLES.containerStyle, containerStyle ]}
            />
        </Box>
    )
}
