import React, { FC } from 'react'
import { Box, Text } from 'components/core'
import { BoxProps } from '../box'
import { TextProps } from '../text'

interface BadgeProps extends Omit<BoxProps, 'bg'> {
    text: string
    color?: BoxProps['bg']
    textColor?: TextProps['color']
}

export const Badge: FC<BadgeProps> = ( { text, color = "primary" } ) => {
    return (
        <Box bg={color} flex={0} alignItems="center" justifyContent="center" px="mini" borderRadius="medium">
            <Text variant="caption" color="white" >{text}</Text>
        </Box>
    )
}
