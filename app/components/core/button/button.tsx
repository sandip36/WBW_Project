import React, { FC } from "react"
import { ActivityIndicator } from "react-native"
import { TouchableBox, TouchableBoxProps } from "../box"
import { Text } from "../text"
import { Theme, useTheme } from "theme"

export type ButtonProps = {
    label: string;
    outline?: boolean;
    loading?: boolean;
    bg?: keyof Theme['colors'],
    size?: 'small' | 'medium',
    textColor?: keyof Theme['colors'],
} & TouchableBoxProps

export const Button: FC<ButtonProps> = ( {
    label,
    disabled,
    outline,
    loading,
    size = 'medium',
    textColor,
    bg,
    ...rest
} ) => {
    const theme = useTheme()
    const height = size === 'small' ? 26 : 46
    const backgroundColor = bg || ( outline ? "background" : disabled ? "lightGrey" : "primary" )
    const _textColor: keyof Theme['colors'] = textColor ?? ( disabled ? "grey" : outline ? "darkGrey" : "white" )
    const borderColor: keyof Theme['colors'] = disabled ? "grey" : "darkGrey"
    const borderWith = outline ? 1 : 0
    return (
        <TouchableBox
            disabled={disabled}
            height={height}
            width="100%"
            borderRadius="medium"
            alignItems="center"
            justifyContent="center"
            borderWidth={outline ? 1 : 0}
            mb="medium"
            {...{ bg: backgroundColor, borderColor, borderWith }}
            {...rest}>
            {!loading && label && <Text variant="body" color={_textColor}>{label}</Text>}
            {loading && <ActivityIndicator size={height / 2} color={theme.colors[_textColor]} />}
        </TouchableBox>
    )
}

Button.defaultProps = {
    outline: false,
    disabled: false,
    loading: false,
    width: "100%",
    size: 'medium'
}
