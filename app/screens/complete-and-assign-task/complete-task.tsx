import { useNavigation } from "@react-navigation/native"
import { Box, Text } from "components"
import { useStores } from "models"
import React from "react"

export type CompleteTaskScreenProps = {

}

export const CompleteTaskScreen: React.FC<CompleteTaskScreenProps> = ( props ) => {
    const navigation = useNavigation()

    return (
        <Box flex={1}>
            <Text>Complete Task</Text>
        </Box>
    )
}