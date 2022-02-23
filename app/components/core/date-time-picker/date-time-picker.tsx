import React from "react"
import { GestureResponderEvent, StyleProp, Text, TextStyle, ViewStyle } from "react-native"
import { Input, TouchableBox } from "components"
import { placeholder } from "i18n-js"
import { IconNode } from "react-native-elements/dist/icons/Icon"
import { makeStyles } from "theme"
import DateTimePickerModal from "react-native-modal-datetime-picker"

export type CustomDateTimePickerProps = {
    customRightIcon?: IconNode,
    numOfLines?: number,
    multiline?: boolean,
    editable?: boolean,
    label?: string,
    placeholder?: string,
    placeholderTextColor?: string,
    textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
    inputContainerStyle?: StyleProp<ViewStyle>,
    show?: boolean,
    onChange?( newDate: Date ): void;
    mode?: "date" | "time" | "datetime";
    is24Hour?: boolean,
    customLabelStyle?: StyleProp<TextStyle>
    inputValue?: string,
    onPress?: ( event: GestureResponderEvent ) => void;
    onConfirm( date: Date ): void;
    onCancel( date: Date ): void;
    maximumDate?: Date,
    minimumDate?: Date,
    defaultValue?: string,
    value: Date,
    display?: any,
    minuteInterval?: any
}


const useStyles = makeStyles<{labelStyle: StyleProp<TextStyle>, inputStyle: Record<string, unknown > | any[], containerStyle: StyleProp<ViewStyle>}>( ( theme ) => ( {
    labelStyle: {
        marginBottom: theme.spacing.mini
    },
    inputStyle: {
        padding: theme.spacing.medium,
        textAlign: 'auto',
        fontSize: theme.textVariants?.heading5?.fontSize,
    },
    containerStyle: {
        borderColor: theme.colors.primary,
        borderRadius: theme.spacing.medium,
        borderWidth: 1
    }
} ) )

export const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ( props ) => {
    const {
        customRightIcon,
        numOfLines,
        multiline,
        editable,
        label,
        placeholder,
        placeholderTextColor,
        textAlignVertical,
        inputContainerStyle,
        show,
        onChange,
        mode,
        is24Hour,
        customLabelStyle,
        inputValue,
        onPress,
        onConfirm,
        onCancel,
        maximumDate,
        minimumDate,
        defaultValue,
        value,
        display,
        minuteInterval
    } = props

    const defaultRightIcon = {
        type: 'font-awesome',
        name: 'calendar',
        color: '#1e5873'
    }
    const rightIcon = customRightIcon || defaultRightIcon
    const STYLES = useStyles()


    return (
        <TouchableBox flex={1} onPress={onPress}>
            <Input
                numberOfLines={numOfLines}
                multiline={multiline}
                editable={editable}
                label={label}
                value={inputValue}
                defaultValue={defaultValue}
                labelStyle={[ STYLES.labelStyle, customLabelStyle ]}
                placeholder={placeholder}
                textAlignVertical={textAlignVertical}
                rightIcon={rightIcon}
                placeholderTextColor="#9EA0A4"
                inputStyle={STYLES.inputStyle}
                inputContainerStyle={[ STYLES.containerStyle, inputContainerStyle ]}
            />
            <DateTimePickerModal
                testID="dateTimePicker"
                mode={mode}
                isVisible={show}
                minuteInterval={minuteInterval}
                is24Hour={is24Hour}
                display={display}
                onChange={onChange}
                date={value}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                onConfirm={onConfirm}
                onCancel={onCancel}
            />
        </TouchableBox>
    )
}

CustomDateTimePicker.defaultProps = {
    mode: 'time',
    is24Hour: false,
    numOfLines: 1,
    multiline: false,
    editable: false,
    label: '',
    placeholder: 'Select Date',
    placeholderTextColor: 'grey',
    textAlignVertical: 'center',
    inputContainerStyle: { },
    show: false,
    inputValue: '',
    onConfirm: ( ) => null,
    onCancel: ( ) => null,
}
