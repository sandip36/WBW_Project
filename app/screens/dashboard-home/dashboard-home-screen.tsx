import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { backgroundColor } from "@shopify/restyle"
import { Box, Header, Text, TouchableBox } from "components"
import { DashboardCard } from "components/dashboard"
import { isEmpty } from "lodash"
import { observer } from "mobx-react-lite"
import {  useStores } from "models"
import React, { useCallback, useEffect, useState } from "react"
import { Async } from "react-async"
import { ActivityIndicator, Alert, FlatList, Linking, Modal, ScrollView, StyleSheet, TouchableOpacity } from "react-native"
import { checkVersion } from "react-native-check-version"
import { Avatar, Icon, ListItem } from "react-native-elements"
import { IuserProfilePayload } from "services/api"
import { theme } from "theme"

export type DashboardHomeScreenProps = {

}

const styles = StyleSheet.create( {
    addImageIcon: {
        height: 30,
        width: 30,
        borderRadius: 15,
        // backgroundColor: "#99AAAB",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute", // Here is the trick
        bottom: 0,
        alignSelf: "flex-end" 
    },
    button: {
        borderRadius: 20,
        elevation: 2,
        padding: 10
    },
    buttonOpen: { 
        backgroundColor : theme.colors.primary, 
        borderColor : theme.colors.black, 
        borderRadius : 5, 
        borderWidth : 1 ,
        marginTop : 25 
    },
    centeredView: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    contentContainerStyle: {
        flexGrow: 1,
        paddingBottom: 30
    },
    iconContainerStyle: {
        backgroundColor: theme.colors.primary,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 15,
        textAlign: "center",
    },
    modalView: {
        alignItems: "center",
        backgroundColor: theme.colors.background,
        borderRadius: 20,
        elevation: 5,
        margin: 20,
        padding: 35,
        shadowColor: theme.colors.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        width: "90%"
    } , subtitle:{
        color: theme.colors.lightGrey,
        fontSize: 12,
        fontWeight: '500',
    },
    textStyle: {
        color: theme.colors.background,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    title:{
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    titleStyle: {
        color: theme.colors.white,
    },
   
} )

export const DashboardHomeScreen: React.FunctionComponent<DashboardHomeScreenProps> = observer( ( ) => {
    const { DashboardStore, AuthStore, ObservationStore, AuditStore,MediaStore ,UserListByCompanyStore ,UserProfileStore } = useStores()
    const [ shouldUpdateApplication, setShouldUpdateApplication ] = useState<boolean>( false )
    const navigation = useNavigation()
    const [ infoVersion,setInfoVersion ]= useState<any>( {} )
    const [ tempurl, setTempUrl ] = useState( `${UserProfileStore.userData.PhotoPath}` )
    const [ dashbordData , setdashbordData ] = useState<any>( [] )
    const [ expanded , setExpanded ] = useState<boolean>( false )



    let formattedbaseUrl = AuthStore.environment.api.apisauce.getBaseURL()
    formattedbaseUrl = formattedbaseUrl.replace( "/MobileAPI/api", "" )



    useEffect( ( ) => {  
        const dateadded = new Date().getTime()
        setTempUrl( `${formattedbaseUrl}${UserProfileStore.userData.PhotoPath}${"&"+ dateadded}` )

    }, [ UserProfileStore.userData.PhotoPath ] )


    useEffect( ( ) => {  
        console.log( "ggggg" )

    }, [ dashbordData ] )


    const fetchDashboard = useCallback( async () => {
        // await UserListByCompanyStore.resetSelectedUser()
        await  UserListByCompanyStore.clearStore()
        await DashboardStore.clearStore()
        await ObservationStore.clearStore()
        await MediaStore.clearStore()
        await MediaStore.setSearchTextTemp( "" )
        // await ObservationStore._clear()
        
        await AuditStore.resetStore()
        // await MediaStore._clear()
        setdashbordData ( await DashboardStore.fetch() )
        fetchUserProfile()
    //     const version = await checkVersion();
    //     setInfoVersion( version )
    //   //  console.log( `App has a ${version} update pending.`,JSON.stringify( version ) );
    //     if ( version.needsUpdate && AuthStore.user.skipCount < 3 && AuthStore.user.shouldShowUpdateModal() ) {
    //         console.log( `App has a ${version.updateType} update pending.` );
    //         setShouldUpdateApplication( true )
    //         // await ObservationStore._clear()
    //         // await AuditStore.resetStore()
    //         // await MediaStore._clear()
    //         // await DashboardStore.fetch()
    //     }else{
    //         await ObservationStore._clear()
    //         await AuditStore.resetStore()
    //         await MediaStore._clear()
    //         await DashboardStore.fetch()
    //     }
    }, [] )


    useFocusEffect(
        React.useCallback( () => {
            ( async () => {
                await MediaStore._clear()
            } )();
        }, [] )
    );


    const fetchUserProfile = useCallback( async () => {
        console.log( "user `" )
        await UserProfileStore.clearStore ()
        const payload = {
            UserID: AuthStore?.user.UserID,
            AccessToken: AuthStore?.token,
        } as IuserProfilePayload
        await UserProfileStore.fetch( payload )
        await UserProfileStore.warnmessage( false )
    }, [] )

    const setIcon=( title: string )=> {
        let iconName = { name:'list-alt', type: 'material-icons' }
        console.tron.log( "ttttttt",title )
        switch ( title ) {
        case 'Profile':
            iconName = { name:'user', type: 'font-awesome' }//
            break
        case 'Bulletins':
            iconName = { name:'announcement', type: 'material-icons' }//
            break
        case 'Inspection':
            iconName = { name:'tasks', type: 'font-awesome-5' }//
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

    const nameSetByTrim=( title: string )=> {
        let iconName = title
        switch ( title ) {
        case 'Profile':
            iconName = 'Profile'
            break
        case 'Bulletins':
            iconName = 'Bulletins'
            break
        case 'Inspection':
            iconName = 'Inspections'
            break
        case 'Audits':
            iconName = 'Audit'
            break
        case 'Observation':
            iconName = 'Observation'
            break
        case 'Incident Management':
            iconName = 'Incident'
            break
        case 'MyTask':
            iconName = 'MyTask'
            break
        }
        return iconName
    } 



    const renderItem = ( { item } ) => {
        console.tron.log( item )
        if( item.length>1 ){
            return(
                <ListItem.Accordion
                    containerStyle={{ backgroundColor:theme.colors.primary , marginHorizontal:theme.spacing.medium , borderRadius:10 ,height:45 , padding:0 , marginTop:theme.spacing.medium }} content={
                        <>
                            <Box style={{ marginHorizontal:25 }} flexDirection={'row'}>
                                <Icon color="white" name={setIcon( item[0].Category ).name}  type= {setIcon( item[0].Category ).type}size={20} />
                                
                                <ListItem.Content style={{ marginHorizontal:25 }}>
                                    <ListItem.Title style={styles.titleStyle}>{nameSetByTrim( item[0].Category )}</ListItem.Title>
                                </ListItem.Content>
                                <ListItem.Chevron></ListItem.Chevron>
                            </Box>
                          
                            
                            
                        </>
                    }
                    isExpanded={expanded}
                    onPress={() => {
                        setExpanded( !expanded );
                    }}
                >
                    {item.map( ( l, i ) => (
                        <Box key={l.id}>
                            <DashboardCard dashboard={l} />
                        </Box>
                
                    ) )}
                </ListItem.Accordion>
            )  
        }
        return item.map( data=>{
            return ( 
                <Box key={data.id}>
                    <DashboardCard dashboard={data} />
                </Box>
               
            )
        } )
      
    }

    const onRightIconPress = ( ) => {
       
        Alert.alert(
            "Logout?",
            "Are you sure you want to logout?",
            [
                {
                    text: "No",
                    onPress: () => null
                },
                {
                    text: "Yes",
                    onPress: ( ) => AuthStore.logout()
                }
            ],
        );
        return true
    }

    const onLeftIconPress = ( ) => {
        navigation.navigate( 'MediaList' )
    }

    const skipUpdate = async ( ) => {
        await AuthStore.user.updateSkipCount()
        await AuthStore.user.setSkippedDate()
        setShouldUpdateApplication( false )
    }
    const onUserSelect = async ( ) => {
        navigation.navigate( 'UserProfile' )
    }

    const updateDialogbox = ( ) => {
        return(
            <Box style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={true}
                >
                    <Box style={styles.centeredView}>
                        <Box style={styles.modalView}>
                            <Text style={styles.modalText}>Update is available. Please download the latest version.</Text>
                            <TouchableOpacity
                                style={[ styles.button, styles.buttonOpen ]}
                                onPress = {() => Linking.openURL( infoVersion?.url )}
                            >
                                <Text style={styles.textStyle}>Update</Text>
                            </TouchableOpacity>
                            <TouchableBox justifyContent="center" marginTop="large" alignItems="center" onPress={skipUpdate}>
                                <Text textAlign="center" fontSize={theme.spacing.regular * 1.2}>
                                Not Now
                                </Text>
                            </TouchableBox>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        )
    }

   

    return (
        <Box flex={1}>
            <Async promiseFn={fetchDashboard}>
                <Async.Pending>
                    { ( ) => (
                        <Box position="absolute" top={0} left={0} right={0} bottom={0} alignItems="center" justifyContent="center">
                            <ActivityIndicator size={32} color="red" />
                        </Box>
                    ) }
                </Async.Pending>
                <Async.Rejected>
                    { ( error: any ) => (
                        <Box justifyContent="center" alignItems="center" flex={1}>
                            <Text>{error.reason || error.message || 'Something went wrong'}</Text>
                        </Box>
                    ) }
                </Async.Rejected>
                <Async.Resolved>
                    {
                        shouldUpdateApplication
                            ? updateDialogbox()
                            :  <Box flex={1}>
                                <Header
                                    //  leftComponent={{ icon: 'video-library', color: '#fff', type: 'material', onPress: onLeftIconPress, style: { marginHorizontal: theme.spacing.small } }} 
                                    title={AuthStore.user?.CompanyName}
                                    rightComponent={{ icon: 'logout', color: '#fff', type: 'material', onPress: onRightIconPress, style: { marginHorizontal: theme.spacing.small } }}
                                />
                                <TouchableBox onPress={()=>onUserSelect( )}>
                                    <Box alignContent={'center'} justifyContent={'center'} alignItems={'center'} margin={'regular'} >
                                        <Avatar 
                                            size={'large'}
                                            rounded
                                            source={{ uri: tempurl }}
                                            key={tempurl}
                                            title= {UserProfileStore.userData.initials}
                                        >
                                            <TouchableBox
                                                style={styles.addImageIcon}
                                                onPress={onUserSelect}
                                            >
                                                {
                                                    <Icon name= 'edit' type= 'MaterialIcons' size={10} color="#FFF" />
                                                }
                                            </TouchableBox>
                                        </Avatar>
                                       
                                        <Box paddingTop={'small'} alignItems={'center'}>
                                            <ListItem.Title style={styles.title}>{UserProfileStore.userData.FirstName +" "+ UserProfileStore.userData.LastName}</ListItem.Title>
                                            <ListItem.Title style={styles.subtitle}>{UserProfileStore.userData.CompanyName}</ListItem.Title>
                                        </Box>
                                      
                                    </Box>
                                </TouchableBox>

                             
                              
                                <ScrollView contentContainerStyle={styles.contentContainerStyle} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>

                                    <Box mt="small">
                                        <FlatList 
                                            data={DashboardStore.sortDashboardByPageOrderArray( dashbordData )}
                                            renderItem={renderItem}
                                            keyExtractor={( item, index ) => item.id }
                                            // contentContainerStyle={{ paddingBottom: 100 }}

                                        />
                                    </Box>  
                                </ScrollView>   
                            </Box>
                    }
                </Async.Resolved>
            </Async>
        </Box>
    )
} )
