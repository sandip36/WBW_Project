import React, { useState, forwardRef } from "react"
import { Input, InputProps } from "./input"

export type SecureInputProps = InputProps

export const SecureInput = forwardRef<any, SecureInputProps>( ( { onRightIconPress, ...rest }, ref ) => {
    const [isSecured, setIsSecured] = useState<boolean>( true )
    const rightIcon = isSecured ? "eye" : "eye-off"
    const _onRightIconPress = ( e ) => {
        if ( onRightIconPress ) {
            onRightIconPress( e )
        }
        setIsSecured( !isSecured )
    }
    return <Input ref={ref} secureTextEntry={isSecured} {...{ rightIcon }} onRightIconPress={_onRightIconPress} {...rest} />
} )

SecureInput.displayName = 'SecureInput'
