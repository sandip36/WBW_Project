import React, { memo, FC } from 'react'
import { RadioContext } from './RadioProvider'
import { Icon, TouchableBox, TouchableBoxProps } from 'components'
import { Box } from '../box'

export interface RadioButtonProps {
    checked?: boolean,
    onPress?: ( ) => void
}

export const RadioButton: React.FC<RadioButtonProps> = memo( ( { checked } ) => {
    return (
        <Icon name={checked ? "radio-button-checked" : "radio-button-unchecked"} type="material" size={24} />
    )
}, ( prevProps, nextProps ) => prevProps.checked === nextProps.checked )

RadioButton.displayName = "MemoizedRadioButton"

export interface RadioProps extends Omit<TouchableBoxProps, 'onPress'> {
    value: string,
    disabled?: boolean
}

export const Radio: FC<RadioProps> = ( { value, disabled, children, ...rest } ) => {
    const { value: providerValue, onChange } = React.useContext( RadioContext )
    return (
        <TouchableBox disabled={disabled} onPress={() => onChange( value )} flexDirection="row" alignItems="center" {...rest}>
            {!disabled ? <RadioButton checked={value === providerValue} /> : <Box height={24} width={24} />}
            {children}
        </TouchableBox>
    )
}
