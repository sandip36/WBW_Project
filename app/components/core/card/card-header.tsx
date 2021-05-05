import React, { FunctionComponent } from "react"
import { Box } from "components"
import { BoxProps } from "../box"
import { Text } from "../text"
import { StyleSheet } from "react-native"

export type CardHeaderProps = {
    title: string;
    rightIcon: string;
    leftIcon: string;
} & BoxProps

export const CardHeader: FunctionComponent<CardHeaderProps> = ({
    title,
    rightIcon,
    leftIcon,
    ...rest
}) => {
    return (
        <Box 
            flexDirection="row"
            alignItems="center"
            minHeight={32}
            borderBottomWidth={StyleSheet.hairlineWidth}
            borderBottomColor="lightBorder"
            px="large"
            {...rest}>
            <Text variant="caption">{title}</Text>
        </Box>
    )
}