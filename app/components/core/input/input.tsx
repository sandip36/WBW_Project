import React from 'react'
import { ColorValue, StyleProp, TextStyle, ViewStyle } from 'react-native'
import { Input as RNEInput, InputProps } from "react-native-elements"
import { makeStyles, Theme } from 'theme'


export type InputStyleProps = {
    labelStyle?: StyleProp<TextStyle>,
    inputContainerStyle?: StyleProp<ViewStyle>
    inputStyle?: StyleProp<TextStyle>,
}

const useStyles = makeStyles<InputStyleProps>( ( theme ) => ( {
    labelStyle: {
        marginBottom: theme.spacing.small,
        color: theme.colors.primary,
        fontSize: theme.textVariants?.heading5?.fontSize
    },
    inputContainerStyle: {
        borderWidth: 1, 
        borderColor: theme.colors.primary, 
        borderRadius: theme.spacing.medium,
    },
    inputStyle: {
        padding: theme.typography.medium,
        textAlign: 'auto',
        fontSize: theme.spacing.regular
    }
} ) )


export type CustomInputProps = {
    label?: string | React.ReactElement<any>
    labelStyle?: StyleProp<TextStyle>,
    placeholder?: string
    placeholderTextColor?: ColorValue,
    inputContainerStyle?: StyleProp<ViewStyle>,
    inputStyle?: StyleProp<TextStyle>,
    error?: string,
    errorStyle?: StyleProp<TextStyle>,
    value?: string,
    onChangeText?: ( text: string ) => void,
    containerStyle?: StyleProp<ViewStyle>
} & InputProps

export const Input: React.FunctionComponent<CustomInputProps> = ( props ) => {
    const {
        label,
        labelStyle,
        placeholder,
        placeholderTextColor,
        inputContainerStyle,
        inputStyle,
        error,
        errorStyle,
        value,
        onChangeText,
        containerStyle,
        ...rest
    } = props
    const STYLES = useStyles()
    const defaultContainerStyle = error ? { marginVertical: 0 } : { marginVertical: -5 }
    return (
        <RNEInput 
            label={label}
            labelStyle={[ STYLES.labelStyle, labelStyle ]}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            inputContainerStyle={[ STYLES.inputContainerStyle, inputContainerStyle ]}
            inputStyle={[ STYLES.inputStyle, inputStyle ]}
            containerStyle={[ defaultContainerStyle, containerStyle ]}
            errorMessage={error}
            errorStyle={errorStyle}
            value={value}
            onChangeText={onChangeText}
            { ...rest }
        />
    )
}

Input.defaultProps = {
    placeholderTextColor: '#9EA0A4',
}