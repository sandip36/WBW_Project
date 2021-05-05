import React, { FC } from "react"
import { GestureResponderEvent, StyleSheet } from "react-native"
import { Box, TouchableBox, BoxProps } from "../box"
import { getIconType } from "./helpers"
import { Theme, useTheme } from "theme"
import { IconType, IconNames } from "./IconTypes"

export type IconProps = {
    name: IconNames;
    size?: number;
    color?: keyof Theme['colors'];
    iconRatio?: number;
    type?: IconType,
    rounded?: boolean;
    raised?: boolean;
    onPress?: ( e: GestureResponderEvent ) => void
} & BoxProps

export const Icon: FC<IconProps> = ( {
    name,
    size,
    color = 'text',
    iconRatio,
    onPress,
    rounded,
    raised,
    type,
    ...rest
} ) => {
    const theme = useTheme()
    const WrapperComponent = onPress ? TouchableBox : Box
    const iconSize = size * iconRatio
    const IconComponent = getIconType( type )
    const STYLES = StyleSheet.create( {
        wrapperStyle: {
            borderRadius: rounded ? size / 2 : 0,
            elevation: raised ? 8 : 0
        }
    } )

    return (
        <WrapperComponent
            width={size}
            height={size}
            justifyContent="center"
            alignItems="center"
            style={STYLES.wrapperStyle}
            {...{ onPress }}
            {...rest}>
            <IconComponent size={iconSize} {...{ name, color: theme.colors[color] }} />
        </WrapperComponent>
    )
}

Icon.defaultProps = {
    iconRatio: 0.7,
    rounded: false,
    type: 'feather',
    size: 16
}
