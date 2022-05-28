import React, { useEffect } from "react"
import { GestureResponderEvent, StyleProp, Text, TextStyle, ViewStyle } from "react-native"
import { Box, CustomDateTimePicker, Input, TouchableBox } from "components"
import { makeStyles } from "theme"
import { IDynamicControlsModel, IDynamicForm, useStores } from "models"
import { isEmpty } from "lodash"

export type CalendarProps = {
    item: IDynamicControlsModel
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

export const Calendar: React.FC<CalendarProps> = ( props ) => {
    const { TaskStore } = useStores()
    const { 
        item
    } = props

    useEffect( ( ) => {
        TaskStore.setcurrentDueDateValue()
        TaskStore.resetDatePicker()
    }, [] )

    return (
        <Box my="medium" flex={1}>
            <CustomDateTimePicker
                label={item.ControlLabel}
                onPress={TaskStore.showDatePicker}
                show={TaskStore.datePicker?.show}
                inputValue={isEmpty( TaskStore.datePicker?.value ) ? TaskStore.currentDueDateValue : TaskStore.datePicker?.value }
                value={TaskStore.datePicker?.datePickerValue}
                mode="date"
                onConfirm={TaskStore.formatDate}
                onCancel={TaskStore.hideDatePicker}
            />
        </Box>
    )
}

