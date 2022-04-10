/* eslint-disable react-native/no-color-literals */
import { Box, Icon, Text } from "components"
import React from "react"
import { Platform, StyleProp, ViewStyle } from "react-native"
import RNPickerSelect, { Item } from "react-native-picker-select"

export type DropdownProps = {
    title: string,
    items: Item[],
    value: string,
    onValueChange: ( value: any, index: number ) => any,
    customIcon?: React.ReactNode,
    onDonePress?: ( ) => any,
    customContainerStyle?: StyleProp<ViewStyle>,
    isRequired?: boolean,
    // key?: any,
    // itemKey?: any
}

const defaultIcon = () => {
    return <Icon name="caret-down" color="primary" size={24} type="fontawesome" />;
}

export const Dropdown: React.FC<DropdownProps> = ( props ) => {
    Dropdown.displayName = "Dropdown"
    const {
        title,
        items,
        onValueChange,
        customIcon,
        onDonePress,
        value,
        customContainerStyle,
        isRequired
        // itemKey,
        // key   
    } = props

    const myPickerStyles = Platform.OS === "android" ? 
        { 
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
            iconContainer: {       
                top: 10,
                right: 12, 
            } 
        } 
        : 
        { 
            inputIOS: { 
                borderColor: '#1e5873',
                borderRadius: 8,
                borderWidth: 1,
                color: 'black',
                fontSize: 16,
                paddingHorizontal: 10,
                paddingRight: 30,
                paddingVertical: 8, 
            },
            iconContainer: {       
                top: 10,
                right: 12, 
            } 
        }

    const Icon = defaultIcon || customIcon
    
    return (
        <Box flex={1} marginVertical="medium" marginHorizontal="large" style={customContainerStyle}>
            {
                isRequired
                    ?  <Box flexDirection={"row"}>
                        <Text color="primary" fontWeight="bold" mb="medium" variant="heading5">{title}</Text>
                        <Text color="lightRed"> *</Text>
                    </Box>
                    :  <Box>
                        <Text color="primary" fontWeight="bold" mb="medium" variant="heading5">{title}</Text>
                    </Box>
            }
            <RNPickerSelect 
                items={items}
                value={value}
                onValueChange={onValueChange}
                // key={key}
                // itemKey={itemKey}
                useNativeAndroidPickerStyle={false}
                style={myPickerStyles}
                Icon={Icon}
                onDonePress={onDonePress}
            />
        </Box>
    )
}


