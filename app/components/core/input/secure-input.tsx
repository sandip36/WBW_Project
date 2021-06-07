import React, { useState } from "react"
import { StyleProp, ViewStyle } from "react-native"
import { makeStyles } from "theme"
import { Input, CustomInputProps } from "./input"

export type SecureInputProps = CustomInputProps

const useStyles = makeStyles<{ rightIconContainerStyle: StyleProp<ViewStyle>}>( ( theme ) => ( {
    rightIconContainerStyle: {
        marginHorizontal: theme.spacing.medium
    }
} ) )
export const SecureInput: React.FunctionComponent<SecureInputProps> = ( props ) => {
    const {
        rightIconContainerStyle,
        ...rest
    } = props
    const STYLES = useStyles()
    const [ isSecured, setIsSecured ] = useState<boolean>( true )
    const secureIcon = isSecured ? "eye" : "eye-off"

    const onRightIconPress = ( ) => {
        setIsSecured( isSecured => !isSecured )
    }

    const rightIcon = { 
        name: secureIcon,
        type: 'feather',
        onPress: onRightIconPress
    }
    return (
        <Input
            secureTextEntry={isSecured} 
            rightIcon={rightIcon}
            rightIconContainerStyle={[ STYLES.rightIconContainerStyle, rightIconContainerStyle ]}
            {...rest}
        />
    )
}

SecureInput.displayName = 'SecureInput'
