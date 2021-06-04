import React from "react"
import { Box, Text } from "components"

export type WelcomeScreenProps = {

}
export const WelcomeScreen: React.FunctionComponent<WelcomeScreenProps> = ( ) => {
    return (
        <Box flex={1} justifyContent="center" alignItems="center">
            <Text>Welcome Home Screen</Text>
        </Box>
    )
}
