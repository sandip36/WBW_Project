import { useNavigation } from "@react-navigation/native"
import { Box, Text } from "components"
import { useStores } from "models"
import React from "react"

export type AssignTaskScreenProps = {

}

export const AssignTaskScreen: React.FC<AssignTaskScreenProps> = ( props ) => {
    const navigation = useNavigation()

    return (
        <Box flex={1}>
            <Text>Assign Task</Text>
        </Box>
    )
}