import React, { FC } from "react"
import { StatusBar } from "react-native"
import { renderComponent, renderIcon } from "../../utils"
import { AvatarProps, Avatar } from "../avatar"
import { Box, BoxProps } from "../box"
import { IconProps } from "../icon"
import { Text, TextProps } from "../text"
import { useTheme } from "theme"

export type HeaderProps = {
    leftIcon?: string | IconProps;
    title?: string;
    rightIcon?: string | IconProps;
    rightText?: string | TextProps | Text;
    rightAvatar?: string | AvatarProps;
    onLeftIconPress?: ( ) => void;
    onRightIconPress?: ( ) => void;
    onRightAvatarPress?: ( ) => void;
} & BoxProps

export const Header: FC<HeaderProps> = ( {
    leftIcon,
    onLeftIconPress,
    rightText,
    rightIcon,
    onRightIconPress,
    rightAvatar,
    onRightAvatarPress,
    title,
    ...rest
} ) => {
    const { STATUS_BAR_HEIGHT } = useTheme()
    const height = 56
    return (
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" height={height + STATUS_BAR_HEIGHT} pt="large" px="large" {...rest}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <Box flex={1}>
                { leftIcon && renderIcon( leftIcon, { size: height / 2.24, onPress: onLeftIconPress } as any ) }
            </Box>
            { title && (
                <Box flex={3} alignItems="center">
                    <Text variant="headline">{ title }</Text>
                </Box>
            ) }
            <Box flex={1} alignItems="flex-end">
                { rightIcon && renderIcon( rightIcon, { size: height / 2.24, onPress: onRightIconPress } as any ) }
                { rightAvatar && renderComponent( Avatar, typeof rightAvatar === 'string' ? { source: { uri: rightAvatar } } : { size: height / 2.24, onPress: onRightAvatarPress, ...rightAvatar } ) }
                { rightText && renderComponent( Text, rightText ) }
            </Box>
        </Box>
    )
}
