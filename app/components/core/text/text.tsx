import { ComponentPropsWithRef } from 'react'
import { createText, } from "@shopify/restyle"
import { Theme } from "theme"

export const Text = createText<Theme>()
export type TextProps = ComponentPropsWithRef<typeof Text>
