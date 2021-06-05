import { createTheme, useTheme as useReTheme } from "@shopify/restyle"
import { TextStyle, ViewStyle, ImageStyle, StyleProp } from "react-native"
import { scale } from 'react-native-size-matters'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { images } from "./images"

export const BASE_FONT_SIZE = 12
export const STATUS_BAR_HEIGHT = getStatusBarHeight()

export const assets = {
    wbwLogo: images.WBW_Logo
}

export const NORMALIZED_FONT_SIZE = scale( BASE_FONT_SIZE )

const colors = {
    primary: "#1e5873",
    placeholder: '#9EA0A4',
    secondary: "#E55812",
    tertiary: "#0f6e9f",
    error: "#e11b1b",
    warning: "#FFBE4F",
    success: "#2faf1a",
    limeGreen: '#a7aa28',
    background: "#F7F7FF",
    pointsBackground: "#F5F5F5",
    offbackground: "#F7F7FF",
    text: "#003049",
    textDisabled: "#9E9E9E",
    grey: "#8E8E8E",
    lightGrey: "#c3c6d6",
    darkGrey: "#9E9E9E",
    border: "rgba(0,0,0,0.5)",
    lightBorder: "#C8C7CC",
    white: "#FFFFFF",
    brightRed: '#FF0000',
    transparent: "rgba(0,0,0,0)",
    black: "rgba(0,0,0,1)",
    black75: "rgba(0,0,0,0.75)",
    black50: "rgba(0,0,0,0.5)",
    black25: "rgba(0,0,0,0.25)",
    black5: "rgba(0,0,0,0.05)",
    accent1: "#D6ECFF",
    accent2: "#FCE6CE",
    lightRed: "#D64152",
    lightGrey2: "#3C3C3C",
    lightPink: "rgba(247, 127, 0, 0.17)",
    lightPink1: "#F8E3CE",
    lightGrey3: "#D7D7D7",
    lightGrey4: '#818181',
    lightGrey5: '#504E4E',
    lighterBorder: '#EEEEEE',
    subHeadingColor: '#A1A1A1',
    lightGreyBorder: '#554F4F',
    caribbeanGreenPearl: "#70D48C",
    manhattan: "#F7bEA3",
    playerSelection: "rgba(200,255,50,0.5)"
}

export const theme = createTheme( {
    colors,
    breakpoints: {},
    typography: {
        mini: 4,
        small: 8,
        medium: 12,
        semiMedium: 14,
        default: 16,
        large: 24,
        extraLarge: 36,
        huge: 48,
        massive: 64  
    },
    spacing: {
        small: NORMALIZED_FONT_SIZE / 4,
        mini: NORMALIZED_FONT_SIZE / 3,
        medium: NORMALIZED_FONT_SIZE / 2,
        regular: NORMALIZED_FONT_SIZE,
        large: NORMALIZED_FONT_SIZE * 1.5,
        extraLarge: NORMALIZED_FONT_SIZE * 2,
        huge: NORMALIZED_FONT_SIZE * 3,
        massive: NORMALIZED_FONT_SIZE * 4,
        STATUS_BAR_HEIGHT,
        negative8: -8,
        negative16: -16
    },
    boxWithShadow: {
        shadowColor: colors.lightGrey2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    borderRadii: {
        massive: 500,
        small: NORMALIZED_FONT_SIZE / 5,
        medium: NORMALIZED_FONT_SIZE / 4,
        large: NORMALIZED_FONT_SIZE / 2
    },
    zIndices: {
        z0: 0,
        z10: 10,
    },
    textVariants: {
        headline: {
            fontFamily: "NunitoSans-Bold",
            fontSize: NORMALIZED_FONT_SIZE * 2,
            lineHeight: ( NORMALIZED_FONT_SIZE * 2.1333 ) * 1.5,
            color: 'text'
        },
        heading1: {
            fontFamily: "NunitoSans-Bold",
            fontSize: NORMALIZED_FONT_SIZE * 2.1333,
            lineHeight: ( NORMALIZED_FONT_SIZE * 2.1333 ) * 1.5,
            color: 'text'
        },
        heading2: {
            fontFamily: "NunitoSans-Bold",
            fontSize: NORMALIZED_FONT_SIZE * 1.4285,
            lineHeight: ( NORMALIZED_FONT_SIZE * 1.4285 ) * 1.5,
            color: 'text'
        },
        heading3: {
            fontFamily: "NunitoSans-Regular",
            fontSize: NORMALIZED_FONT_SIZE * 1.4285,
            lineHeight: ( NORMALIZED_FONT_SIZE * 1.4285 ) * 1.5,
            color: 'text'
        },
        heading4: {
            fontFamily: "NunitoSans-Regular",
            fontSize: NORMALIZED_FONT_SIZE * 1.25,
            lineHeight: ( NORMALIZED_FONT_SIZE * 1.25 ) * 1.5,
            color: 'text'
        },
        heading5: {
            fontFamily: "NunitoSans-Regular",
            fontSize: NORMALIZED_FONT_SIZE * 1.05,
            lineHeight: ( NORMALIZED_FONT_SIZE * 1.05 ) * 1.5,
            color: 'text'
        },
        body: {
            fontFamily: "NunitoSans-Regular",
            fontSize: NORMALIZED_FONT_SIZE,
            lineHeight: NORMALIZED_FONT_SIZE * 1.5,
            color: 'text'
        },
        caption: {
            fontFamily: "NunitoSans-Regular",
            fontSize: NORMALIZED_FONT_SIZE * 0.8574,
            lineHeight: ( NORMALIZED_FONT_SIZE * 0.8574 ) * 1.25,
            color: 'text'
        },
        caption1: {
            fontFamily: "NunitoSans-Regular",
            fontSize: NORMALIZED_FONT_SIZE * 0.6574,
            lineHeight: ( NORMALIZED_FONT_SIZE * 0.6574 ) * 1.25,
            color: 'text'
        }
    },
    STATUS_BAR_HEIGHT,
    BASE_FONT_SIZE: NORMALIZED_FONT_SIZE,
    assets
} )
export default theme

export type Theme = typeof theme

export const useTheme = () => useReTheme<Theme>()
type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle | StyleProp<ViewStyle> | StyleProp<TextStyle> | StyleProp<ImageStyle> };

export const makeStyles = <T extends NamedStyles<T>, U = unknown>(
    styles: ( theme: Theme, data: U ) => T
) => ( data?: U ) => {
        const currentTheme = useTheme()
        return styles( currentTheme, data )
    }
