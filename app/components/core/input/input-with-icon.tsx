import React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { Input, CustomInputProps } from "./input"

export type InputWithIconProps = {
    leftIcon?: any
    rightIcon?: any,
    leftIconContainerStyle?: StyleProp<ViewStyle>,
    rightIconContainerStyle?: StyleProp<ViewStyle>
} & CustomInputProps

export const InputWithIcon: React.FunctionComponent<InputWithIconProps> = ( props ) => {
    const {
        leftIcon,
        rightIcon,
        leftIconContainerStyle,
        rightIconContainerStyle,
        ...rest
    } = props

    return (
        <Input
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            rightIconContainerStyle={rightIconContainerStyle}
            leftIconContainerStyle={leftIconContainerStyle}
            {...rest}
        />
    )
}

InputWithIcon.displayName = 'InputWithIcon'
