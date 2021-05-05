import { createBox, BoxProps as REBoxProps } from "@shopify/restyle"
import { PropsWithChildren } from "react"
import { View, TouchableOpacityProps, TouchableOpacity, ScrollView, ViewProps } from "react-native"
import { BorderlessButton, BorderlessButtonProperties, RectButton, RectButtonProperties } from "react-native-gesture-handler"
import { Theme } from "theme"

export type BoxProps = REBoxProps<Theme> & ViewProps
export type RectBoxProps = BoxProps & RectButtonProperties
export type TouchableBoxProps = BoxProps & TouchableOpacityProps
export type BorderlessButtonBoxProps = BoxProps & BorderlessButtonProperties

export const Box = createBox<Theme>( View )
export const RectBox = createBox<Theme>( RectButton )
export const TouchableBox = createBox<Theme, PropsWithChildren<TouchableBoxProps>>( TouchableOpacity )
export const BorderlessButtonBox = createBox<Theme, PropsWithChildren<BorderlessButtonProperties>>( BorderlessButton )
export const ScrollBox = createBox<Theme, PropsWithChildren<BorderlessButtonProperties>>( ScrollView )
