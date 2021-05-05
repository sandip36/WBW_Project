import { createRestyleComponent, createRestyleFunction, ResponsiveValue } from "@shopify/restyle"
import { Box } from "../box"
import { Theme } from "theme"

const height = createRestyleFunction( {
    property: 'size',
    styleProperty: 'height',
    themeKey: 'spacing'
} )

export const Divider = createRestyleComponent<{size?: ResponsiveValue<keyof Theme['spacing'], Theme> }, Theme>( [height], Box )

Divider.defaultProps = {
    size: 'medium'
}
