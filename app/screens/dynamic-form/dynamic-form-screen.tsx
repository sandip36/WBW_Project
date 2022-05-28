import { useNavigation } from "@react-navigation/native"
import { Box, Input, Text, TextAreaInput } from "components"
import { Calendar } from "components/core/calendar"
import { Dropdown } from "components/core/dropdown"
import { FormHeader } from "components/core/header/form-header"
import { isEmpty } from "lodash"
import { Observer } from "mobx-react-lite"
import { IDynamicControlsModel, IDynamicForm, useStores } from "models"
import React, { useCallback } from "react"
import { Async } from "react-async"
import { ActivityIndicator, FlatList, StyleProp, ViewStyle } from "react-native"
import { CheckBox } from "react-native-elements"
import { makeStyles, theme } from "theme"

export type DynamicFormScreenProps = {

}

const useStyles = makeStyles<{contentContainerStyle: StyleProp<ViewStyle>}>( ( theme ) => ( {
    contentContainerStyle: {
        flexGrow: 1,
        paddingBottom: 50
    }
} ) )

export const DynamicFormScreen: React.FunctionComponent<DynamicFormScreenProps> = ( ) => {
    const { DynamicFormStore, TaskStore } = useStores()
    const navigation = useNavigation()
    const STYLES = useStyles()

    const fetchDashboard = useCallback( async () => {
        await TaskStore.setcurrentDueDateValue()
        await TaskStore.resetDatePicker()
        await DynamicFormStore.fetch()
    }, [] )

    const ItemSeparatorComponent = ( ) => {
        return (
            <Box height={24} />
        )
    }

    const renderDynamicControls = ( { item }: { item: IDynamicControlsModel } ) => {
        switch( item.ControlType ) {
        case 'Textbox': {
            return (
                <Box my="medium">
                    <Input  
                        label={item.ControlLabel}
                        value={item.SelectedValue}
                    // onChangeText={item.setSelectedValue}
                    />
                </Box>
            )
        }
        case 'DropDownList':                               
            return (
                <Box my="medium">
                    <Dropdown
                        title={item.ControlLabel}
                        items={item.dropdownList}
                        value={item.SelectedValue}
                        onValueChange={( value )=>{
                            if( !isEmpty( value ) ){
                                item.setSelectedValueForDropdown( value )
                            }
                        }}
                    />
                </Box>
            )
        case 'Calendar':
            return (
                <Observer>
                    {
                        () => (
                            <Box flex={1}>
                                <Calendar item={item} />
                            </Box>
                        )
                    }
                </Observer>
            )
        case 'Checkbox':
            return (
                null
            )
        case 'CheckBoxList':
            return (
            // <CustomMultiSelectCheckbox value={value} />
                null
            )
        case 'RadioButtonList':
            return (
                null
            )
        case 'TextArea':
            return (
                <Box my="medium">
                    <TextAreaInput 
                        label={item.ControlLabel}
                        inputContainerStyle={{ marginHorizontal: theme.spacing.small }}
                        labelStyle={{ color: theme.colors.primary, fontSize: theme.textVariants.heading5?.fontSize, marginHorizontal: theme.spacing.small, marginVertical: theme.spacing.small  }}
                        defaultValue={item.SelectedValue}                        
                        // onChangeText={item.setSelectedValue}
                    />
                </Box>
            )
        }
    }

    const renderItem = ( { item }: {item: IDynamicForm } ) => {
        return (
            <Box flex={1}>
                <Box flex={1} mt="small" marginHorizontal="regular" p="regular" borderRadius="medium" justifyContent="center" alignItems="center" backgroundColor="primary">
                    <Text color="background"  fontWeight="bold">{item.GroupName}</Text>
                </Box>
                <FlatList 
                    data={item.sortDynamicControlsByDisplayOrder}
                    renderItem={renderDynamicControls}
                    keyExtractor={( item, index ) => String( index )}
                    contentContainerStyle={STYLES.contentContainerStyle}
                    ItemSeparatorComponent={ItemSeparatorComponent}
                />
            </Box>
        )
    }

    return (
        <Box flex={1}>
            <Async promiseFn={fetchDashboard}>
                <Async.Pending>
                    { ( ) => (
                        <Box position="absolute" top={0} left={0} right={0} bottom={0} alignItems="center" justifyContent="center">
                            <ActivityIndicator size={32} color="red" />
                        </Box>
                    ) }
                </Async.Pending>
                <Async.Rejected>
                    { ( error: any ) => (
                        <Box justifyContent="center" alignItems="center" flex={1}>
                            <Text>{error.reason || error.message || 'Something went wrong'}</Text>
                        </Box>
                    ) }
                </Async.Rejected>
                <Async.Resolved>
                    <Box flex={1}>
                        <FormHeader 
                            title="Dynamic Form"
                            navigation={navigation}
                        />
                        <Box>
                            <FlatList 
                                data={DynamicFormStore.items.slice()}
                                renderItem={renderItem}
                                keyExtractor={( item, index ) => String( index )}
                                contentContainerStyle={STYLES.contentContainerStyle}
                                ItemSeparatorComponent={ItemSeparatorComponent}
                            />
                        </Box>    
                    </Box>
                </Async.Resolved>
            </Async>
        </Box>
    )
}