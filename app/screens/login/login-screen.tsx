import React from "react"
import { Box, Text } from "components"

export type LoginScreenProps = {

}
export const LoginScreen: React.FunctionComponent<LoginScreenProps> = ( ) => {
    return (
        <Box flex={1} justifyContent="center" alignItems="center">
            <Text>Login Screen</Text>
        </Box>
    )
}
