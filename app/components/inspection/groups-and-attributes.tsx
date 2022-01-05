import { Box, Input, InputWithIcon, Text, TextAreaInput } from "components"
import React from "react"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "models"
import { FlatList, StyleProp, ViewStyle } from "react-native"
import { makeStyles, theme } from "theme"
import { Dropdown } from "components/core/dropdown"

export type GroupsAndAttributesProps = {
    groupId: string
}

const ItemSeparatorComponent = ( ) => {
    return (
        <Box height={24} />
    )
}

const useStyles = makeStyles<{contentContainerStyle: StyleProp<ViewStyle>}>( ( theme ) => ( {
    contentContainerStyle: {
        paddingBottom: theme.spacing.extraLarge
    }
} ) )

export const GroupsAndAttributes: React.FunctionComponent<GroupsAndAttributesProps> = ( props ) => {
    const {
        groupId
    } = props
    const navigation = useNavigation()
    const STYLES = useStyles()
    const { AuditStore } = useStores()

    const renderItem = ( { item } ) => {
        return (
            <Box flex={1} my="regular">
                <Box marginHorizontal="regular">
                    <Text variant="heading4" marginHorizontal="medium" fontWeight="bold">{item.AttributeOrder}. {item.Title}</Text>
                </Box>
                <Dropdown
                    title={AuditStore?.inspection?.AuditAndInspectionDetails?.ScoringLable}
                    items={AuditStore.getDropdownData( item.ScoreList )}
                    value={item.GivenAnswerId}
                    onValueChange={() => null }
                />
                <Dropdown
                    title="Source"
                    items={AuditStore.sourceList}
                    value={item.sourceID}
                    onValueChange={() => null }
                />
                <Dropdown
                    title="Hazard List"
                    items={AuditStore.hazardList}
                    value={item.HazardsID}
                    onValueChange={() => null }
                />
                <Box marginHorizontal="regular" mt="regular">
                    <TextAreaInput 
                        label="Comments"
                        labelStyle={{ color: theme.colors.primary, fontSize: theme.textVariants.heading5?.fontSize  }}
                        placeholder="Upload Image"
                        value="abcd"
                    // onChangeText={handleChange( "username" )}
                    /> 
                </Box>
                <Box marginHorizontal="regular">
                    <InputWithIcon 
                        rightIcon={{ name: 'camera', type: 'font-awesome' }}
                        labelStyle={{ color: theme.colors.primary , fontSize: theme.textVariants?.heading5?.fontSize }}
                        label="Upload Image"
                        placeholder="Upload Image"
                    // onChangeText={handleChange( "username" )}
                    /> 
                </Box>
            </Box>
            
        )
    }

    return (
        <Box flex={1}>
            <FlatList 
                data={AuditStore.groupsAndAttributesData( groupId )}
                renderItem={renderItem}
                keyExtractor={( item ) => item.ControlID }
                contentContainerStyle={STYLES.contentContainerStyle}
                ItemSeparatorComponent={ItemSeparatorComponent}
            />
        </Box>
    )
}