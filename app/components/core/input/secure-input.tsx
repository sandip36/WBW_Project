import React, { useState } from "react"
import { Input, CustomInputProps } from "./input"

export type SecureInputProps = CustomInputProps

export const SecureInput: React.FunctionComponent<SecureInputProps> = ( props ) => {
    const {
        ...rest
    } = props
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
            {...rest}
        />
    )
}

SecureInput.displayName = 'SecureInput'
