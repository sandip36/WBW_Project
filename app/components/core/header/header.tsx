import { Platform } from "@unimodules/core"
import { Box } from "components"
import React, { FunctionComponent } from "react"
import { StyleProp, TextProps, TextStyle, ViewStyle } from "react-native"
import { Header as RNEHeader } from "react-native-elements"
import { IconObject } from "react-native-elements/dist/icons/Icon"
import { makeStyles, useTheme } from "theme"

const useStyles = makeStyles<{containerStyle: StyleProp<ViewStyle>, centerStyle: StyleProp<TextStyle> }>( ( theme ) => ( {
    containerStyle: {
        
        height: Platform.OS==="ios"? theme.STATUS_BAR_HEIGHT : 48+ theme.STATUS_BAR_HEIGHT,
        paddingTop: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    centerStyle: {
        color: theme.colors.white,
        fontSize: theme.spacing.large,
        fontWeight: 'bold',
    }
} ) )

interface HeaderIcon extends IconObject {
    icon?: string;
    text?: string;
    color?: string;
    style?: StyleProp<TextStyle>;
}

export type HeaderProps = {
    title: string,
    containerStyle?: StyleProp<ViewStyle>,
    centerStyle?: StyleProp<TextStyle>,
    rightComponent?: React.ReactElement<any> | TextProps | HeaderIcon;
}

export const Header: FunctionComponent<HeaderProps> = props => {
    const {
        title,
        containerStyle,
        centerStyle,
        rightComponent
    } = props
    const STYLES = useStyles()
    const theme = useTheme()
    return (
        <Box>
            <RNEHeader
                statusBarProps={{ barStyle: "light-content", translucent: true, backgroundColor: "transparent" }}
                placement="center"
                centerComponent={{ text: title, style: [ STYLES.centerStyle, centerStyle ] }}
                rightComponent={rightComponent}
                backgroundColor={theme.colors.primary}
                containerStyle={[ STYLES.containerStyle, containerStyle ]} />
        </Box>
    )
}
