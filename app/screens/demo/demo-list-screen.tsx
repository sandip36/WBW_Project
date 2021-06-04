import React from "react"
import { Box, Text } from "components"

export type DemoListScreenProps = {

}
export const DemoListScreen: React.FunctionComponent<DemoListScreenProps> = ( ) => {
    return (
        <Box flex={1} justifyContent="center" alignItems="center">
            <Text>DemoList Screen</Text>
        </Box>
    )
}
