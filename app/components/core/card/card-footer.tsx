import React, { FunctionComponent } from "react"
import { Box } from "components"
import { BoxProps } from "../box"
import { Text } from "../text"

export type CardFooterProps = { } & BoxProps

export const CardFooter: FunctionComponent<CardFooterProps> = ({
    ...rest
}) => {
    return (
        <Box minHeight={32} {...rest}>
            <Text variant="caption">Hello World</Text>
        </Box>
    )
}