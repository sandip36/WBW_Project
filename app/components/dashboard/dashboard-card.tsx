import { useNavigation } from '@react-navigation/core'
import { Box } from 'components'
import { useStores } from 'models'
import { IDashboard } from 'models/models/dashboard-model'
import React from 'react'
import { StyleProp, TextStyle, ViewStyle } from 'react-native'
import { ListItem } from 'react-native-elements'
import { makeStyles  } from 'theme'

export interface DashboardCardProps {
    dashboard: IDashboard,
    containerStyle?: StyleProp<ViewStyle>,
    titleStyle?: StyleProp<TextStyle>
}

export type DashboardCardStyleProps = {
    containerStyle: StyleProp<ViewStyle>,
    titleStyle: StyleProp<TextStyle>
}

const useStyles = makeStyles<DashboardCardStyleProps>( ( theme ) => ( {
    containerStyle: {
        paddingLeft: theme.spacing.regular,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.spacing.medium,
        borderWidth: 1,
        paddingVertical: theme.spacing.large
    },
    titleStyle: {
        color: theme.colors.white
    }
} ) )

export const DashboardCard: React.FunctionComponent<DashboardCardProps> = ( props ) => {
    const {
        dashboard,
        containerStyle,
        titleStyle
    } = props
    const navigation = useNavigation()
    const { DashboardStore } = useStores()
    const STYLES = useStyles()

    const onDashboardPress = async ( ) => {
        await DashboardStore.setCurrentDashboardId( dashboard?.AuditandInspectionTemplateID )
        if( dashboard?.Category === "POC" ) {
            navigation.navigate( 'DynamicControls' )
        }else if( dashboard?.Type === "Audit-originator" ) {
            navigation.navigate( 'AuditAndInspectionScreen' )
        }else{
            navigation.navigate( 'ObservationHistory' )
        }
    }

    return (
        <Box flex={1} mt="medium" mx="medium" py="small">
            <ListItem bottomDivider containerStyle={[ STYLES.containerStyle, containerStyle ] } onPress={onDashboardPress}>
                <ListItem.Content>
                    <ListItem.Title style={[ STYLES.titleStyle, titleStyle ]}>{dashboard.Title}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        </Box>
    )
}