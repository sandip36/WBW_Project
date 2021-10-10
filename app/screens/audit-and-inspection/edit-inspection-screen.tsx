import { Box, Text } from "components"
import React from "react"

export type EditInspectionScreenProps = {

}

export const EditInspectionScreen: React.FC<EditInspectionScreenProps> = ( ) => {
    return (
        <Box flex={1} justifyContent="center" alignItems="center">
            <Text>Edit Inspection</Text>
        </Box>
    )
}