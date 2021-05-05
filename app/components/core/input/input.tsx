import React, { forwardRef, useState } from "react"
import { TextInput, ViewStyle, TextInputProps, GestureResponderEvent, StyleProp, TextStyle, TextProps } from "react-native"
import { Box, BoxProps } from "../box"
import { Icon } from "../icon"
import { Text } from "../text"
import { theme, Theme } from "theme"
import { renderComponent } from "components/utils"
import { IconType } from "../icon/helpers"
import { AvatarProps } from "components"

export type InputProps = {
    disabled?: boolean;
    leftIcon?: string;
    rightIcon?: string;
    touched?: boolean;
    error?: string;
    compact?: boolean;
    label?: string;
    height?: number;
    secureTextEntry?: boolean;
    customTextInputStyle?: StyleProp<TextStyle>;
    subText?: string | TextProps,
    maxLength?: number;
    onRightIconPress?: ( e: GestureResponderEvent ) => void,
    value?: string;
    rightIconType?: IconType
    customColor?: keyof Theme['colors'],
    leftAvatar?: string | number | AvatarProps;
    leftText?: string | TextProps,
    rightIconColor?: keyof Theme['colors'],
} & BoxProps & TextInputProps

const countIndicator = ( currLength, maxLength ) => `Characters Allowed: ${currLength}/${maxLength}`

export const Input = forwardRef<any, InputProps>( ( {
    disabled,
    leftIcon,
    rightIcon,
    leftText,
    onRightIconPress,
    error,
    touched,
    label,
    height,
    compact = false,
    customTextInputStyle,
    secureTextEntry,
    subText,
    maxLength,
    onChangeText,
    rightIconType = 'feather',
    rightIconColor,
    customColor = 'primary',
    ...rest
}, ref ) => {
    const [ defaultSubtext, setDefaultSubtext ] = useState( maxLength ? countIndicator( 0, maxLength ) : '' )
    const size = compact ? 36 : 48
    const heightSize = height || size
    const textInputStyle = { color: theme.colors.text, minHeight: size, padding: 0, fontSize: 20, paddingLeft: theme.spacing.mini, alignSelf: 'center', flex: 1, margin: 0 } as ViewStyle
    const defaultTextProps = { fontSize: 12, lineHeight: 19, color: 'error' }
    const validationColor: keyof Theme['colors'] = error ? 'error' : 'primary'
    let color: keyof Theme['colors'] = !touched ? 'grey' : validationColor
    if ( rightIconColor ) {
        color = rightIconColor
    } else {
        if ( customColor && !error && touched ) {
            color = customColor
        } else if ( error && touched ) {
            color = 'error'
        } else if ( disabled ) {
            color = 'lightGrey'
        }
    }

    const showSubText = subText || maxLength

    const onChange = ( value: string ) => {
        onChangeText( value )

        if ( maxLength ) {
            setDefaultSubtext( countIndicator( value.length, maxLength ) )
        }
    }

    return (
        <Box width="100%" my="mini">
            { label && (
                <Box height={16}>
                    <Text variant="caption1" color="grey">{ label }</Text>
                </Box>
            ) }
            <Box flexDirection="row" width="100%" borderRadius="medium" alignItems="center" px="medium" borderColor={color} borderWidth={1} height={heightSize}>
                {leftIcon && <Icon name={leftIcon} size={size / 2} {...{ color }} />}
                {leftText && <Text fontSize={size / 2.4} {...{ color }} > {leftText} </Text>}
                <TextInput onChangeText={onChange} maxLength={maxLength} ref={ref} editable={!disabled} underlineColorAndroid="transparent" style={[ textInputStyle, customTextInputStyle ]} secureTextEntry={secureTextEntry} {...rest} />
                { rightIcon && <Icon name={rightIcon} color={color} size={size / 2} type={rightIconType} iconRatio={0.95} onPress={ onRightIconPress } {...{ color }} /> }
            </Box>
            { showSubText === subText && !error && renderComponent( Text, subText, { ...defaultTextProps } ) }
            { showSubText === maxLength && !error && renderComponent( Text, defaultSubtext, { ...defaultTextProps } ) }
            <Box height={16} justifyContent="center">
                { touched && error && <Text variant="caption" color="error">{error}</Text> }
            </Box>
        </Box>
    )
} )

Input.displayName = "Input"

Input.defaultProps = {
    disabled: false,
    touched: false,
    secureTextEntry: false,
    error: undefined
}

export type InputType = typeof Input
