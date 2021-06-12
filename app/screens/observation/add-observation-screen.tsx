import { Box, Text } from "components"
import React from "react"

export type AddObservationScreenProps = {

}

export const AddObservationScreen: React.FunctionComponent<AddObservationScreenProps> = ( props ) => {
    return (
        <Box flex={1} justifyContent="center" alignItems="center">
            <Text>Add Observation Screen</Text>
        </Box>
    )
}