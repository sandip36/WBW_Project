import { useNavigation } from '@react-navigation/core'
import { Box } from 'components'
import { useStores } from 'models'
import { IDashboard } from 'models/models/dashboard-model'
import React from 'react'
import { Alert, AsyncStorage, Linking, StyleProp, TextStyle, ViewStyle } from 'react-native'
import { ListItem } from 'react-native-elements'
import { makeStyles  } from 'theme'
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import { isEmpty } from 'lodash'

export interface DashboardCardProps {
    dashboard: IDashboard,
    containerStyle?: StyleProp<ViewStyle>,
    titleStyle?: StyleProp<TextStyle>
}

export type DashboardCardStyleProps = {
    containerStyle: StyleProp<ViewStyle>,
    titleStyle: StyleProp<TextStyle>,
    inAppBrowserStyle: any
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
    },
    inAppBrowserStyle: {
        // iOS Properties
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: 'white',
        preferredControlTintColor: 'white',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: false,
        toolbarColor: '#FFFFFF',
        secondaryToolbarColor: '#FFFFFF',
        navigationBarColor: '#FFFFFF',
        navigationBarDividerColor: '#FFFFFF',
        enableUrlBarHiding:true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        // Specify full animation resource identifier(package:anim/name)
        // or only resource name(in case of animation bundled with app).
        animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right'
        },
        // headers: {
        //   'my-custom-header': 'my custom header value'
        // }
    }
} ) )

export const DashboardCard: React.FunctionComponent<DashboardCardProps> = ( props ) => {
    const {
        dashboard,
        containerStyle,
        titleStyle
    } = props
    const navigation = useNavigation()
    const { DashboardStore, AuthStore } = useStores()
    const STYLES = useStyles()

    const openInAppBrowser = async ( link ) => {
        const url = `${link}&U=${AuthStore.user.UserID}&T=${AuthStore.token}`
        try {
            // const token = await AsyncStorage.getItem( 'Token' )
           
            if ( await InAppBrowser.isAvailable() ) {
                const result = await InAppBrowser.open( url )
            }
            else Linking.openURL( url )
        } catch ( error ) {
            await InAppBrowser.close()
            if ( await InAppBrowser.isAvailable() ) {
                const result = await InAppBrowser.open( url )
            }
            else Linking.openURL( url )
        }
    }

    const onDashboardPress = async ( ) => {
        await DashboardStore.setCurrentDashboardId( dashboard?.HomePageOrder )
        if( dashboard?.LinkType === "WebsiteLink" && !isEmpty( dashboard?.Link ) ) {
            const formattedUrl = `${dashboard?.Link}&U=${AuthStore.user.UserID}&T=${AuthStore.token}`
            navigation.navigate( 'WebView', {
                url: formattedUrl
            } )
        }else if( dashboard?.LinkType === "WebsiteLink" && isEmpty( dashboard?.Link ) ) {
            Alert.alert( "Error", "Invalid dashboard link" )
        }
        else if( dashboard?.Category === "POC" ) {
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