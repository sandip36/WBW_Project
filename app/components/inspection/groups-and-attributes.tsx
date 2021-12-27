import { Box, Icon, Text, TouchableBox } from "components"
import { AuditAndInspectionListingType } from "models/models/audit-model"
import React from "react"
import { isEmpty } from "lodash"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "models"
import { FlatList, StyleProp, ViewStyle } from "react-native"
import { makeStyles } from "theme"
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
        paddingBottom: theme.spacing.large
    }
} ) )

export const GroupsAndAttributes: React.FunctionComponent<GroupsAndAttributesProps> = ( props ) => {
    const {
        groupId
    } = props
    const navigation = useNavigation()
    const STYLES = useStyles()
    const { AuditStore } = useStores()

    console.tron.log( 'inside groups and attrbutes' )

    const renderItem = ( { item } ) => {
        console.tron.log( 'item is ',item )
        return null
        // return (
        //     <Dropdown
        //         title={AuditStore?.inspection?.AuditAndInspectionDetails?.ScoringLable}
        //         items={AuditStore.getDropdownData( item.ScoreList )}
        //         value={item.GivenAnswerId}
        //         onValueChange={() => null }
        //     />
        // )
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