import React from "react"
import { Icon, IconProps } from "./core/icon"

export const renderComponent = <P extends unknown>(
    Component: any,
    content: any,
    defaultProps?: P
) => {
    if ( content == null || content === false ) {
        return null
    }

    if ( React.isValidElement( content ) ) {
        return content
    }

    if ( typeof content === 'function' ) {
        return content()
    }

    if ( content === true ) {
        return <Component {...defaultProps} />
    }
    if ( typeof content === 'string' ) {
        if ( content.length === 0 ) {
            return null
        }
        return <Component {...defaultProps}>{content}</Component>
    }
    if ( typeof content === 'number' ) {
        return <Component {...defaultProps}>{content}</Component>
    }
    return <Component {...defaultProps} {...content} />
}

export const renderIcon = ( name: string | IconProps, defaultProps: Omit<IconProps, "name"> ) =>
    renderComponent<Omit<IconProps, "name">>(
        Icon,
        typeof name === 'string' ? { name } : name,
        defaultProps )