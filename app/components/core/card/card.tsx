import React, { FunctionComponent } from "react"
import { Box } from "components"
import { CardHeader } from "./card-header"
import { CardFooter } from "./card-footer"
import { BoxProps, TouchableBox } from "../box"

export type CardProps = {
    borderless?: boolean;
    title?: string;
    rightHeaderIcon?: string;
    leftHeaderIcon?: string;
    footerCaption?: string;
    rightFooterIcon?: string;
    leftFooterIcon?: string;
    showHeader?: boolean;
    showFooter?: boolean;
    onPress?: ( ) => void
} & BoxProps

export const Card: FunctionComponent<CardProps> = ({
    borderless,
    title,
    rightHeaderIcon,
    leftHeaderIcon,
    children,
    showFooter = false,
    showHeader = false,
    onPress = ( ) => null,
    ...rest
}) => {

    if ( title || rightHeaderIcon || leftHeaderIcon ) {
        showHeader = true
    }

    return (
        <TouchableBox bg="white" {...rest} onPress={onPress}>
            { showHeader && <CardHeader title={title} rightIcon={rightHeaderIcon} leftIcon={leftHeaderIcon} /> }
            <Box px="large">
                {children}
            </Box>
            { showFooter && <CardFooter /> }
        </TouchableBox>
    )
}