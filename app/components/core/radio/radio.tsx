import { Box, Text } from 'components'
import React from 'react'
import { makeStyles, theme  } from 'theme'
import RadioForm from "react-native-simple-radio-button"
import { useStores } from 'models'

export interface RadioProps {
    label?: string,
    radioList?: any,
    initial?: number,
    onPress?: ( value ) => any,
    radioStyle?: any,
    labelStyle?: any,
    radioContainerStyle?: any,
    formHorizontal?: boolean,
    labelHorizontal?: boolean
}

export type RadioStyleProps = {
    radioStyle: any,
    labelStyle: any,
    radioContainerStyle: any
}

const useStyles = makeStyles<RadioStyleProps>( ( theme ) => ( {
    radioStyle: {
        paddingRight: theme.spacing.huge
    },
    labelStyle: {
        fontSize: theme.typography.semiMedium
    },
    radioContainerStyle: {
        paddingHorizontal: theme.spacing.regular,
    }
} ) )

export const Radio: React.FunctionComponent<RadioProps> = ( props ) => {
    const {
        label,
        radioList,
        initial,
        onPress,
        radioStyle,
        radioContainerStyle,
        labelStyle,
        formHorizontal,
        labelHorizontal
    } = props

    const { AuditStore } = useStores()
    const STYLES = useStyles()
    const RADIO_LIST = [
        { label: 'Complete Task', value: "Complete Task" },
        { label: 'Assign Task', value: "Assign Task" }
    ]
    
    return (
        <Box flex={1} mt="medium" mx="medium">
            <Box my="medium">
                <Text 
                    color="primary"
                    fontWeight="bold"
                    variant="body"
                    fontSize={theme.typography.semiMedium}
                    pl="large"
                    mb="medium"
                >
                    {label}
                </Text>
            </Box>
            <RadioForm 
                radio_props={RADIO_LIST || radioList }
                initial={initial}
                formHorizontal={formHorizontal}
                labelHorizontal={labelHorizontal}
                radioStyle={[ STYLES.radioStyle, radioStyle ]}
                buttonColor={theme.colors.radioButton}
                selectedButtonColor={theme.colors.primary}
                labelStyle={[ STYLES.labelStyle, labelStyle ]}
                animation={true}
                style={[ STYLES.radioContainerStyle, radioContainerStyle ]}
                onPress={onPress}
            />
        </Box>
    )
}

Radio.defaultProps = {
    label: 'Please Select',
    radioList: [
        'Complete Task',
        'Assign Task'
    ],
    initial: 0,
    formHorizontal: true,
    labelHorizontal: true
}