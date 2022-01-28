import { Box, Text } from 'components'
import React from 'react'
import { StyleProp, TextStyle, ViewStyle } from 'react-native'
export interface AuditDetailsRowProps {
    title: string,
    value: string
}

export type DashboardCardStyleProps = {
    containerStyle: StyleProp<ViewStyle>,
    titleStyle: StyleProp<TextStyle>
}


export const AuditDetailsRow: React.FunctionComponent<AuditDetailsRowProps> = ( props ) => {
    const {
        title,
        value
    } = props
    
    return (
        <Box flexDirection="row" marginHorizontal="medium" marginVertical="medium" backgroundColor="transparent">
            <Box>
                <Text pl="medium" pr="small" color="black" variant="heading5" fontWeight="bold">{title}</Text>
            </Box>
            <Box>
                <Text pl="small" pr="small" color="black" variant="body" numberOfLines={0}>{value}</Text>
            </Box>
        </Box>
    )
}