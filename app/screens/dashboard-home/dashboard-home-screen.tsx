import { Box, Text } from "components"
import React from "react"

export type DashboardHomeScreenProps = {

}

export const DashboardHomeScreen: React.FunctionComponent<DashboardHomeScreenProps> = ( ) => {
    return (
        <Box flex={1} justifyContent="center" alignItems="center">
            <Text>Dashboard Home Screen</Text>
        </Box>
    )
}