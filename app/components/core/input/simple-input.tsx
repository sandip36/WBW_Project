import React, { forwardRef } from "react"
import { TextInputProps, GestureResponderEvent, StyleSheet, TextInput, ViewStyle } from "react-native"
import { Box, BoxProps } from "../box"
import { Icon } from "../icon"
import { Theme } from "theme"

export type SimpleInputProps = {
    disabled?: boolean;
    leftIcon?: string;
    rightIcon?: string;
    compact?: boolean;
    solid?: boolean;
    onRightIconPress?: ( e: GestureResponderEvent ) => void
    onLeftIconPress?: ( e: GestureResponderEvent ) => void
} & BoxProps & TextInputProps

export const SimpleInput = forwardRef<any, SimpleInputProps>( ( {
    disabled,
    leftIcon,
    rightIcon,
    onRightIconPress,
    onLeftIconPress,
    compact = false,
    solid = true,
    ...rest
}, ref ) => {
    const size = compact ? 36 : 50
    let color: keyof Theme['colors'] = 'grey'
    if ( disabled ) {
        color = 'lightGrey'
    }
    const textInputStyle = { minHeight: size, padding: 0, alignSelf: 'center', flex: 1, margin: 0 } as ViewStyle

    return (
        <Box
            flexDirection="row"
            width="100%"
            borderRadius="large"
            alignItems="center"
            justifyContent="center"
            px="medium"
            borderColor={solid ? 'transparent' : color}
            bg={solid ? 'black5' : 'background' }
            borderWidth={StyleSheet.hairlineWidth}
            height={size}>
            <Box mr="mini">
                {leftIcon && <Icon name={leftIcon} size={size / 2} {...{ color }} onPress={onLeftIconPress} />}
            </Box>
            <TextInput ref={ref} editable={!disabled} underlineColorAndroid="transparent" style={textInputStyle} {...rest} />
            <Box ml="mini">
                { rightIcon && <Icon name={rightIcon} size={size / 2} iconRatio={0.95} onPress={ onRightIconPress } {...{ color }} /> }
            </Box>
        </Box>
    )
} )

SimpleInput.displayName = "Input"

SimpleInput.defaultProps = {
    disabled: false,
    compact: false,
    solid: true
}

export type SimpleInputType = typeof SimpleInput
