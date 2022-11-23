import { useNavigation } from '@react-navigation/core'
import { Box } from 'components'
import { useStores } from 'models'
import { IDashboard } from 'models/models/dashboard-model'
import React from 'react'
import { Alert, AsyncStorage, Linking, StyleProp, Text, TextStyle, ViewStyle } from 'react-native'
import { Avatar, Icon, ListItem } from 'react-native-elements'
import { makeStyles  } from 'theme'
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import { isEmpty } from 'lodash'

export interface DashboardCardProps {
    dashboard: IDashboard,
    isChildren?:boolean,
    showTrimName?:boolean
    containerStyle?: StyleProp<ViewStyle>,
    titleStyle?: StyleProp<TextStyle>
    iconContainerStyle?:StyleProp<TextStyle>
}

export type DashboardCardStyleProps = {
    containerStyle: StyleProp<ViewStyle>,
    titleStyle: StyleProp<TextStyle>,
    iconContainerStyle:StyleProp<ViewStyle>,
    inAppBrowserStyle: any
}

const useStyles = makeStyles<DashboardCardStyleProps>( ( theme ) => ( {
    containerStyle: {
        paddingLeft: theme.spacing.regular,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.spacing.medium,
        borderWidth: 1,
        paddingVertical: theme.spacing.negative16,
     
    },
    titleStyle: {
        color: theme.colors.white,
        fontSize: 20,
    },
    iconContainerStyle: {
        backgroundColor: theme.colors.primary
        
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
        titleStyle,
        showTrimName,
        isChildren
    } = props
    const navigation = useNavigation()
    const { DashboardStore, AuthStore,UserProfileStore } = useStores()
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
            openInAppBrowser( dashboard.Link )
        }else if( dashboard?.Category === "Profile" ) {
            //  await UserProfileStore.clearStore()

            navigation.navigate( 'UserProfile' )
        }else if( dashboard?.Category === "Webview" ) {
            const formattedUrl = `${dashboard?.Link}&U=${AuthStore.user.UserID}&T=${AuthStore.token}`
            navigation.navigate( 'WebView', {
                url: formattedUrl,
                tital:dashboard.Title

            } )
        }else

        if( dashboard?.Category === "Bulletins" ) {
            navigation.navigate( 'MediaList' )
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

    const setIcon=( title: string )=> {
        let iconName = { name:'list-alt', type: 'material-icons' }
        switch ( title ) {
        case 'Inspection ':
            iconName = { name:'magnify-scan', type: 'material-community' }
            break
        case 'Profile':
            iconName = { name:'user', type: 'font-awesome' }//
            break
        case 'Bulletins':
            iconName = { name:'announcement', type: 'material-icons' }//
            break
        case 'Audits':
            iconName = { name:'announcement', type: 'material-icons' }
            break
        case 'Observation':
            iconName = { name:'magnify-scan', type: 'material-community' }
            break
        case 'Incident Management':
            iconName = { name:'alert-triangle', type: 'feather' }//
            break
        case 'MyTask':
            iconName = { name:'tasks', type: 'font-awesome-5' }//
            break
        }
        // return  data = { name:'sandip', type: 'font-awesome' }
        return iconName
    } 
    const nameSetByTrim=( title: IDashboard )=> {
        let iconName = title.Title

        if( title.Category ==='Profile' ){
            iconName = 'Profile'
            return iconName
        }
        if( title.Category ==='Bulletins' ){
            iconName = 'Bulletins'
            return iconName
        }
        if( title.Category ==='Incident Management' ){
            iconName = 'Incidents'
            return iconName
        }
        if( title.Category ==='Inspection ' ){
            iconName = 'Inspections'
            return iconName
        }
        if( title.Category ==='Observation' ){
            iconName = 'Observations'
            return iconName
        }
        if( title.Category ==='Audit' ){
            iconName = 'Audits'
            return iconName
        }
        if( title.Category ==='MyTask' ){
            iconName = 'My Tasks'
            return iconName
        }
        return iconName 
    } 

    if( isChildren ){
        return (
            <Box flex={1} mt="medium" mx="large" py="small"  justifyContent={'center'}>
                <ListItem  containerStyle={[ STYLES.containerStyle, containerStyle ] } onPress={onDashboardPress}>
                    <Box height={30}>
                        { showTrimName?
                            <ListItem.Content>
                                <ListItem.Title style={{ fontSize:16 } }>{nameSetByTrim( dashboard )}</ListItem.Title>
                            </ListItem.Content>
                            :
                            <ListItem.Content>
                                <ListItem.Title style={{ fontSize:16 , color: 'white' } }>{dashboard.Title}</ListItem.Title>
                            </ListItem.Content>
                      
                        }
                    </Box>
                   
                </ListItem>
            </Box>
        )
    }else{
 
        return (
            <Box flex={1} mt="medium" mx='medium' py="small"  justifyContent={'center'}>
                <ListItem bottomDivider containerStyle={[ STYLES.containerStyle, containerStyle ] } onPress={onDashboardPress}>
                    <Avatar 
                        size={50}
                        rounded
                        icon={setIcon( dashboard.Category )}
                        containerStyle={STYLES.iconContainerStyle} 
                    />
                    { showTrimName?
                        <ListItem.Content>
                            <ListItem.Title style={[ STYLES.titleStyle, titleStyle ]}>{nameSetByTrim( dashboard )}</ListItem.Title>
                        </ListItem.Content>
                        :
                        <ListItem.Content>
                            <ListItem.Title style={[ STYLES.titleStyle, titleStyle ]}>{nameSetByTrim( dashboard )}</ListItem.Title>
                        </ListItem.Content>
                      
                    }
                    <Icon color="white" name='chevron-right'  type= "feather" size={25} />


                </ListItem>
            </Box>
        )
    }
}
