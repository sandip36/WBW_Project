import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { IconNode } from 'react-native-elements/dist/icons/Icon'
import { makeStyles } from 'theme'
import { Button, CustomButtonProps } from './button'

export type ButtonWithIconProps = {
    icon?: IconNode,
    iconContainerStyle?: StyleProp<ViewStyle>,
    iconRight?: boolean
} & CustomButtonProps

const useStyles = makeStyles<{ buttonStyle?: StyleProp<ViewStyle>}>( ( theme ) => ( {
    buttonStyle: {
        padding: theme.typography.medium,
    }
} ) )

export const ButtonWithIcon: React.FunctionComponent<ButtonWithIconProps> = ( props ) => {  
    const {
        icon,
        iconContainerStyle,
        iconRight,
        ...rest
    } = props
    const STYLES = useStyles()

    const IconPosition = iconRight ? 'right' : 'left'

    return (
        <Button 
            icon={icon}
            iconContainerStyle={iconContainerStyle}
            iconPosition={IconPosition}
            buttonStyle={STYLES.buttonStyle}
            { ...rest }
        />
    )
}

ButtonWithIcon.displayName = "ButtonWithIcon"