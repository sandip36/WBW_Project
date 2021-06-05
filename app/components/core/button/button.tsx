import React from 'react'
import { StyleProp, TextProps, TextStyle, ViewStyle } from 'react-native'
import { Button as RNEButton, ButtonProps } from "react-native-elements"
import { makeStyles } from 'theme'

export type ButtonStyleProps = {
    containerStyle?: StyleProp<ViewStyle>,
    buttonStyle?: StyleProp<ViewStyle>,
    titleStyle?: StyleProp<TextStyle>
}

const useStyles = makeStyles<ButtonStyleProps>( ( theme ) => ( {
    containerStyle: {
        marginHorizontal: theme.spacing.regular,
        marginVertical: theme.spacing.regular,
        borderRadius: theme.spacing.medium
    },
    buttonStyle: {
        padding: theme.typography.default,
        backgroundColor: theme.colors.primary
    },
    titleStyle: {
        fontSize: theme.typography.semiMedium,
        fontWeight: 'bold'
    }
} ) )
export type CustomButtonProps = {
    title: string
    titleStyle?: StyleProp<TextStyle>,
    titleProps?: TextProps,
    onPress?: ( ) => void,
    loading?: boolean,
    disabled?: boolean,
    containerStyle?: StyleProp<ViewStyle>,
    buttonStyle?: StyleProp<ViewStyle>
} & ButtonProps

export const Button: React.FunctionComponent<CustomButtonProps> = ( props ) => {  
    const {
        title,
        titleStyle,
        titleProps,
        onPress,
        loading,
        disabled,
        containerStyle,
        buttonStyle,
        ...rest
    } = props

    const STYLES = useStyles()

    return (
        <RNEButton 
            title={title}
            titleStyle={[ STYLES.titleStyle, titleStyle ]}
            titleProps={titleProps}
            onPress={onPress}
            loading={loading}
            disabled={disabled}
            containerStyle={[ STYLES.containerStyle, containerStyle ]}
            buttonStyle={[ STYLES.buttonStyle, buttonStyle ]}
            { ...rest }
        />
    )
}