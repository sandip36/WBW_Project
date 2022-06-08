import React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { makeStyles } from "theme"
import { Input, CustomInputProps } from "./input"

export type TextAreaInputProps = CustomInputProps

const useStyles = makeStyles<{ inputContainerStyle: StyleProp<ViewStyle>}>( ( theme ) => ( {
    inputContainerStyle: {
        minHeight: theme.spacing.massive,
        maxHeight: theme.spacing.massive * 3
    }
} ) )


export const TextAreaInput: React.FunctionComponent<TextAreaInputProps> = ( props ) => {
    const {
        numberOfLines,
        textAlignVertical,
        inputContainerStyle,
        ...rest
    } = props

    const STYLES = useStyles()

    return (
        <Input
            multiline={true}
            numberOfLines={numberOfLines}
            textAlignVertical={textAlignVertical}
            inputContainerStyle={[ STYLES.inputContainerStyle, inputContainerStyle ]}
            {...rest}
        />
    )
}

TextAreaInput.defaultProps = {
    numberOfLines: 3,
    textAlignVertical: 'top'
}

TextAreaInput.displayName = 'InputWithIcon'
