import { Box, Text } from "components"
import React from "react"

export type StartInspectionScreenProps = {

}

export const StartInspectionScreen: React.FC<StartInspectionScreenProps> = ( ) => {
    return (
        <Box flex={1} justifyContent="center" alignItems="center">
            <Text>Start Inspection</Text>
        </Box>
    )
}