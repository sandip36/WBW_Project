

import { useFocusEffect, useNavigation } from "@react-navigation/core"
import React, { useCallback, useEffect, useState } from "react"
import { Alert, BackHandler, Image, ImageStyle, Platform, ScrollView, StyleProp, ViewStyle } from "react-native"
import { makeStyles } from "theme"
import { StackActions, useRoute } from "@react-navigation/native";
import { FormHeader } from "components/core/header/form-header";
import { Box, Button, Input, SearchableList,TouchableBox } from "components";
import { IImages, useStores } from "models";
import { IuserProfilePayload, IuserProfileSavaPayload } from "services/api";
import { useKeyboard } from "@react-native-community/hooks"
import { AuditDetailsRow } from "components/audit-detail-row/audit-details-row";
import { Avatar, Icon, ListItem } from "react-native-elements";
import { isEmpty } from "lodash";
import { observer } from "mobx-react-lite";
import { ICompanyUserListmodel } from "models/models/user-list-by-company-model/user-list-by-comany-model";




export type UserProfileScreenProps = {
    url: string
    tital:string
}

export type UserProfileStyleProps = {
    imageStyle: StyleProp<ImageStyle>,
  containerStyle: StyleProp<ViewStyle>

}

const useStyles = makeStyles<{
    keyboardStyle: StyleProp<ViewStyle>;imageStyle: StyleProp<ImageStyle>, inputContainerStyle: StyleProp<ViewStyle>, contentContainerStyle: StyleProp<ViewStyle>, addImageIcon: StyleProp<ViewStyle>,listItemContainerStyle: StyleProp<ViewStyle>, iconContainerStyle: StyleProp<ViewStyle>
}>( ( theme ) => ( {
   
    inputContainerStyle: {
        borderBottomWidth: 1,
        borderColor: theme.colors.primary
    },
    contentContainerStyle: {
        flexGrow: 1,
        paddingBottom: 30
    }, keyboardStyle:{
        height: Platform.OS === 'ios' ? '30%' : '2%' 
    },
    addImageIcon: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: "#99AAAB",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute", // Here is the trick
        bottom: 0,
        alignSelf: "flex-end"
    },
    listItemContainerStyle: {
        flex: 0.1
    },
    iconContainerStyle: {
        backgroundColor: theme.colors.primary
    }, profileImgContainer: {
        marginLeft: 8,
        height: 82,
        width: 82,
        borderRadius: 40,
        borderWidth: 1
    },
    profileImg: {
        height: 80,
        width: 80,
        borderRadius: 40,
    }, avatarContainerStyle: {
        backgroundColor: theme.colors.primary
    }, imageStyle: {
        width: 160,
        height: 160,
        borderRadius:80
    }
   
} ) )

export const UserProfile: React.FunctionComponent<UserProfileScreenProps> = observer( ( props ) => {
    const route = useRoute()
    const { UserProfileStore,AuthStore ,UserListByCompanyStore } = useStores()  
    const navigation = useNavigation()
    const STYLES = useStyles()
    const keyboard = useKeyboard()
    const [ tempurl, setTempUrl ] = useState( `${UserProfileStore.userData.PhotoPath}` )
    const [ loading, setLoading ] = useState( false )
    const [ loadingForSave, setLoadingForSave ] = useState( false  )


    let formattedbaseUrl = AuthStore.environment.api.apisauce.getBaseURL()
    formattedbaseUrl = formattedbaseUrl.replace( "/MobileAPI/api", "" )



    // useFocusEffect(
    //     React.useCallback( () => {
           
    //     }, [] )
    // );

    useEffect( () => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            _handleBackPress
        );
        return () => backHandler.remove();
    }, [] )

    useEffect( ( ) => {  
        fetchUserProfile()

        fetchUserlistByCompany()
        // make sure to catch any error
            .catch( console.error );
    }, [] )


    useEffect( ( ) => {  
        const dateadded = new Date().getTime()
        setTempUrl( `${formattedbaseUrl}${UserProfileStore.userData.PhotoPath}${"&"+ dateadded}` )

    }, [ UserProfileStore.userData.PhotoPath ] )

    const fetchUserlistByCompany = async () => {
        //  await UserProfileStore.toggleEdit( true )
        await UserListByCompanyStore.clearStore()
        await UserListByCompanyStore.hideSearchableModal()

        await UserListByCompanyStore.fetch()
        await UserListByCompanyStore.hideSearchableModal()
    }
   

    const fetchUserProfile = useCallback( async () => {
        await UserProfileStore.clearStore ()
        const payload = {
            UserID: AuthStore?.user.UserID,
            AccessToken: AuthStore?.token,
        } as IuserProfilePayload
        await UserProfileStore.fetch( payload )
        await UserProfileStore.warnmessage( false )
    }, [] )

    const _handleBackPress = ( ) => {
       
        if( UserProfileStore.isShowWarningEdit ){
            Alert.alert(
                "Discard changes?",
                "Are you sure you want to discard the changes?",
                [
                    {
                        text: "No",
                        onPress: () => null
                    },
                    {
                        text: "Yes",
                        onPress: ()=>{
                            UserProfileStore.warnmessage( false )
                            navigation.dispatch( StackActions.pop( ) )

                        }
                    }
                ],
            );
            return true

        }
       
        navigation.dispatch( StackActions.pop( ) );
    }

    const oncancel = async ( ) => {
        Alert.alert(
            "Discard changes?",
            "Are you sure you want to discard the changes?",
            [
                {
                    text: "No",
                    onPress: async () =>null
                },
                {
                    text: "Yes",
                    onPress: async ( ) => {
                        await UserListByCompanyStore.clearStore()
                        navigation.dispatch( StackActions.pop( ) )
                      

                    }
                }
            ],
        );
        return true
    }


    const onImageSelected = async ( image: IImages ) => {
        await UserProfileStore.setImages( image )
        await UserProfileStore.saveImage( image )
    }

    const addOrEditImage = ( ) => {
        navigation.navigate( 'CaptureTaskImage', {
            callback: ( value: IImages ) => onImageSelected( value )
        } )
    }

    const onUserSelect = async ( item: ICompanyUserListmodel ) => {

        await UserListByCompanyStore.setSelectedUser( item )
        await UserProfileStore.setSupervisorID( item?.UserID )
        await UserListByCompanyStore.hideSearchableModal()
    }

    const renderItem = ( { item }: {item: ICompanyUserListmodel } ) => {
        return (
            <TouchableBox onPress={()=>onUserSelect( item )}>
                <ListItem containerStyle={STYLES.listItemContainerStyle}>
                    <Avatar 
                        rounded size={32} 
                        icon={{ name: 'user', type: 'font-awesome' }} 
                        containerStyle={STYLES.iconContainerStyle} 
                        source={{ uri:formattedbaseUrl }}
                        // avatarStyle={STYLES.imageStyle}
                    />
                    <ListItem.Content>
                        <ListItem.Title>{item.FullName}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            </TouchableBox>
        )
    }
    


    
    const expression = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    const onSave = async ( ) => {
        setLoadingForSave( true )

        if( expression.test( UserProfileStore.userData.EmailAddress ) )
        {
            const payload = {
                UserID: AuthStore?.user.UserID,
                AccessToken: AuthStore?.token,
                LastName:UserProfileStore.userData.LastName,
                FirstName:UserProfileStore.userData.FirstName,
                EmailAddress:UserProfileStore.userData.EmailAddress,
                SupervisorID:UserProfileStore.userData.SupervisorID,
                Phone:UserProfileStore.userData.Phone,
                Address:UserProfileStore.userData.Address,
                City:UserProfileStore.userData.City,
                State:UserProfileStore.userData.State,
                Zip:UserProfileStore.userData.Zip,
                Country:UserProfileStore.userData.Country,
                AreaManagerID :UserProfileStore.userData.AreaManagerID

            } as IuserProfileSavaPayload

            await UserProfileStore.SaveUserProfile( payload )
            setLoadingForSave( false )
            navigation.dispatch( StackActions.pop( ) )

        }else{
            Alert.alert( "Email","Please enter correct email" )
            setLoadingForSave( false )


        }
    
    }

    return (
        <Box flex={1}>
            <FormHeader 
                title={"Profile"}
                navigation={navigation}
                customBackHandler={_handleBackPress}

            />
            <Box flex={ UserProfileStore.isEditable?  0.93 :1}>

           
                <ScrollView contentContainerStyle={STYLES.contentContainerStyle} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
                  
                    <Box height='15%' justifyContent={'center'} alignItems={'center'} my={'regular'} flexDirection={"row"} >

                        <Avatar 
                            size={'xlarge'}
                            rounded
                            source={{ uri: tempurl }}
                            key={tempurl}
                            title= {UserProfileStore.userData.initials}
                   
                
                        >
                            <TouchableBox
                                style={STYLES.addImageIcon}
                                onPress={addOrEditImage}
                            >
                                {
                                    isEmpty( UserProfileStore.userData.PhotoPath )
                                        ? <Icon name="add" size={25} color="#FFF" />
                                        : <Icon name= 'camera' type= 'font-awesome' size={25} color="#FFF" />
                                }
                            </TouchableBox>
                        </Avatar>
                    </Box>

                    <Box mx="small">
                  
                        <AuditDetailsRow 
                            title= "User ID:" 
                            value={UserProfileStore.userData.LoginName} 
                        />
                  
                        <Box my={'small'} mb={'small'}>
                            <AuditDetailsRow 
                                title= "Default Level:" 
                                value={UserProfileStore.userData.LevelName} 
                            />

                        </Box>
                        <Box my={'small'} mb={'small'}>
                            <AuditDetailsRow 
                                title= "Department :" 
                                value={UserProfileStore.userData.DepartmentName} 
                            />

                        </Box>
                        <Box my={'regular'}>
                       
                            <Input 
                                label="First name"
                                placeholder="First Name"
                                value={UserProfileStore.userData.FirstName}
                                editable={UserProfileStore.isEditable}
                                onChangeText={ ( text )=>UserProfileStore.setFirstName( text ) }


                            />

                            <Input
                                label="Last name"
                                placeholder="Last Name"
                                value={UserProfileStore.userData.LastName}
                                editable={UserProfileStore.isEditable}
                                onChangeText={ ( text )=>UserProfileStore.setLastName( text ) }

                            />
                            <Input
                                label="Email Address:"
                                placeholder="Email Address"
                                value={UserProfileStore.userData.EmailAddress}
                                editable={UserProfileStore.isEditable}   
                                onChangeText={ ( text )=>UserProfileStore.setEmailAddress( text ) }

                            />
                            {
                                UserListByCompanyStore.showModal 
                                    ? <SearchableList
                                        data={UserListByCompanyStore.items}
                                        customRender={renderItem}
                                        isModalVisible={UserListByCompanyStore.showModal}
                                        closeModal={UserListByCompanyStore.hideSearchableModal}
                                        onUserSelect={onUserSelect}
                                        searchKey={"FullName"}
                                        key={"UserID"}
                                    /> 
                                    : <Box mx="small">
                                        <Input 
                                            label="Supervisor:"
                                            placeholder="Click Here"
                                            onFocus={UserListByCompanyStore.displaySearchableModal}
                                            value={UserListByCompanyStore.selectedUser?.FullName ?? UserProfileStore.userData.Supervisor}
                                            onTouchStart={ UserListByCompanyStore.displaySearchableModal}
                                        />
                                    </Box>
                            }
                          
                            <Input 
                                label="Address"
                                placeholder="Address"
                                value={UserProfileStore.userData.Address}
                                editable={UserProfileStore.isEditable}
                                onChangeText={ ( text ) =>UserProfileStore.setAddress( text ) }

                            />
                            <Input
                                label="City:"
                                placeholder="City"
                                value={UserProfileStore.userData.City}
                                editable={UserProfileStore.isEditable} 
                                onChangeText={ ( text ) =>UserProfileStore.setCity( text ) }

                            />

                            <Input
                                label="State:"
                                placeholder="State"
                                value={UserProfileStore.userData.State}
                                editable={UserProfileStore.isEditable} 
                                onChangeText={ ( text ) =>UserProfileStore.setState( text ) }

                            />
                            <Input
                                label="Zip Code:"
                                placeholder="Zip Code"
                                defaultValue={UserProfileStore.userData.Zip}
                                editable={UserProfileStore.isEditable} 
                                onChangeText={ ( text ) =>UserProfileStore.setZip( text ) }

                            />


                            <Input
                                label="Country:"
                                placeholder="Country"
                                value={UserProfileStore.userData.Country}
                                editable={UserProfileStore.isEditable} 
                                onChangeText={ ( text ) =>UserProfileStore.setZCountry( text ) }

                        
                            />
                            <Input
                                label="Phone:"
                                placeholder="Phone"
                                value={UserProfileStore.userData.Phone}
                                editable={UserProfileStore.isEditable}        
                                onChangeText={ ( text ) =>UserProfileStore.setPhone( text ) }
                            />
                    
                        </Box>
                  
                    </Box>
               
                
                </ScrollView>
                {
                    keyboard.keyboardShown
                        ? <Box style={STYLES.keyboardStyle}
                        />
                        : null
                }
            </Box>
            { UserProfileStore.isEditable?
                <Box flex={0.1}>
                    <Box justifyContent={"space-evenly"} flexDirection={"row"} alignItems={"center"} m={"negative8"} >
                        <Box width={"50%"}>
                            <Button 
                                title="Save"
                                onPress={onSave}
                                loading={loadingForSave}
                            />
                        </Box>
                        <Box width={"50%"}>
                            <Button
                                title="Cancel"
                                onPress={oncancel}
                                
                            />
                        </Box>       
                    </Box>
                </Box>:
                null 
            }
           
           
        </Box>
    )
} )
