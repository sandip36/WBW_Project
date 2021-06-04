import React from "react"
import { Box, Text } from "components"

export type DemoScreenProps = {

}
export const DemoScreen: React.FunctionComponent<DemoScreenProps> = ( ) => {
    return (
        <Box flex={1} justifyContent="center" alignItems="center">
            <Text>Demo Screen</Text>
        </Box>
    )
}
