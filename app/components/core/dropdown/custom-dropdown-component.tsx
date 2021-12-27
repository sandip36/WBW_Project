/* eslint-disable react-native/no-color-literals */
import { Box, Icon, Text } from "components"
import React from "react"
import { StyleSheet, Platform } from "react-native"
import RNPickerSelect, { Item } from "react-native-picker-select"

export type DropdownProps = {
    title: string,
    items: Item[],
    value: string,
    onValueChange: ( value: any, index: number ) => any,
    customIcon?: React.ReactNode,
    onDonePress?: ( ) => any
}

const defaultIcon = () => {
    return <Icon name="caret-down" color="primary" size={24} type="fontawesome" />;
}

export const Dropdown: React.FC<DropdownProps> = React.memo( ( props ) => {
    Dropdown.displayName = "Dropdown"
    const {
        title,
        items,
        onValueChange,
        customIcon,
        onDonePress,
        value
    } = props

    const myPickerStyles = Platform.OS === "android" ? {
        ...styles.inputAndroid,
        iconContainer: { 
            top: 10,
            right: 12, 
        }
    } : {
        ...styles.inputIOS,
        iconContainer: { 
            top: 10,
            right: 12, 
        }
    }

    const Icon = defaultIcon || customIcon
    
    return (
        <Box flex={1} margin="large">
            <Box>
                <Text color="primary" fontWeight="bold" mb="medium" variant="body">{title}</Text>
            </Box>
            <RNPickerSelect 
                items={items}
                value={value}
                onValueChange={onValueChange}
                useNativeAndroidPickerStyle={false}
                style={myPickerStyles}
                Icon={Icon}
                // fixAndroidTouchableBug={true}
                onDonePress={onDonePress}
            />
        </Box>
    )
}, ( prevProps, nextProps ) => {
    return prevProps.value === nextProps.value
} )


const styles = StyleSheet.create( {
    inputAndroid: {
        borderColor: '#1e5873',
        borderRadius: 8,
        borderWidth: 1,
        color: 'black',
        fontSize: 16,
        paddingHorizontal: 10,
        paddingRight: 30,
        paddingVertical: 8,
    },
    inputIOS: {
        borderColor: '#1e5873',
        borderRadius: 4,
        borderWidth: 1,
        color: 'black',
        fontSize: 16,
        paddingHorizontal: 10,
        paddingRight: 30,
        paddingVertical: 12,
    },
} )