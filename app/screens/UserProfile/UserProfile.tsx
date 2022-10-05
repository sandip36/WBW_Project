

import { useFocusEffect, useNavigation } from "@react-navigation/core"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ActivityIndicator, Alert, BackHandler, Button, Image, ImageStyle, Platform, ScrollView, StyleProp, View, ViewStyle } from "react-native"
import { makeStyles, theme } from "theme"
import { useRoute } from "@react-navigation/native";
import { FormHeader } from "components/core/header/form-header";
import { Box, Input, SearchableList, SecureInput, Text, TextAreaInput, TouchableBox } from "components";
import { Dropdown } from "components/core/dropdown";
import { IImages, ICompanyUserListmodel, useStores } from "models";
import { IuserProfilePayload, IuserProfileSavaPayload } from "services/api";
import { useKeyboard } from "@react-native-community/hooks"
import { LabelWithAsterisk } from "screens/observation";
import { AuditDetailsRow } from "components/audit-detail-row/audit-details-row";
import { Avatar, Icon, ListItem } from "react-native-elements";
import { isEmpty } from "lodash";
import { observer } from "mobx-react-lite";





export type UserProfileScreenProps = {
    url: string
    tital:string
}

export type UserProfileStyleProps = {
    imageStyle: StyleProp<ImageStyle>,
  containerStyle: StyleProp<ViewStyle>
  avatarContainerStyle: StyleProp<ViewStyle>

}

const useStyles = makeStyles<{
    textWithShadow: StyleProp<ViewStyle>;
    avatarContainerStyle: StyleProp<ViewStyle>;
   // profileImgContainer: StyleProp<ViewStyle>;
  //  profileImg: StyleProp<ViewStyle>;
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
        width: 150,
        height: 150,
        borderRadius: theme.borderRadii.medium,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textWithShadow:{
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    }
} ) )

export const UserProfile: React.FunctionComponent<UserProfileScreenProps> = observer( ( props ) => {
    const route = useRoute()
    const { UserProfileStore,AuthStore, ObservationStore ,UserListByCompanyStore } = useStores()  
    const navigation = useNavigation()
    const STYLES = useStyles()
    const keyboard = useKeyboard()
    const [ imgUrl, setImgUrl ] = useState( '' )
    const [ loading, setLoading ] = useState( false )
    const [ editabelflag, setEditableFlag ] = useState( true )
    const [ loadingForSave, setLoadingForSave ] = useState( false  )


    let formattedbaseUrl = AuthStore.environment.api.apisauce.getBaseURL()
    formattedbaseUrl = formattedbaseUrl.replace( "/MobileAPI/api", "" )



    useFocusEffect(
        React.useCallback( () => {
            fetchUserProfile()
           
        }, [] )
    );

    useEffect( ( ) => {      
        fetchData()
        // make sure to catch any error
            .catch( console.error );
    }, [] )

    const fetchData = async () => {
        await UserListByCompanyStore.clearStore()  
        await UserListByCompanyStore.fetch()
        await UserListByCompanyStore.hideSearchableModal()
    }
   

    const fetchUserProfile = useCallback( async () => {
        setEditableFlag( true )
        // await UserProfileStore._clear()
        const payload = {
            UserID: AuthStore?.user.UserID,
            AccessToken: AuthStore?.token,
        } as IuserProfilePayload
        await UserProfileStore.fetch( payload )
        await fetchUserProfileImg()
    }, [] )

    const fetchUserProfileImg =()=>{
        if( isEmpty( UserProfileStore.userData.PhotoPath ) ){
            setImgUrl( '' )
            setLoading( false )
        }else{
            let formattedUrl = `${AuthStore.environment.api.apisauce.getBaseURL()}${UserProfileStore.userData.PhotoPath}`
            formattedUrl = formattedUrl.replace( "/MobileAPI/api", "" )
            setImgUrl( formattedUrl )
            setLoading( false )
        }
        
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
    


    const loadAvtar= ()=>{
        console.tron.log( "avatar ",`${formattedbaseUrl}${UserProfileStore.userData.PhotoPath}` )
        if( UserProfileStore.userData.PhotoPath ){
            return(
                <Avatar 
                    size={'xlarge'}
                    rounded
                    //
                    // source={{ uri:"https://demo.test832.com/WorkflowUpload/UserPhoto/bd8f8d80-e07e-4f40-823d-0bee91fb9b8c.jpg?fromMobileAPI=29482384" }}
                    source={{ uri:`${formattedbaseUrl}${UserProfileStore.userData.latestPhotoPath}` }}
                    activeOpacity={0.7}  
                >
                    <TouchableBox
                        style={STYLES.addImageIcon}
                        onPress={addOrEditImage}
                    >
                        {
                            isEmpty( UserProfileStore.userData.PhotoPath )
                                ? <Icon name="add" size={25} color="#FFF" />
                                : <Icon name="edit" size={25} color="#FFF" />
                        }
                    </TouchableBox>
                </Avatar>
            )

        }else{
            console.tron.log( "Inside else" )
            return(
                <Avatar 
                    size={'xlarge'}
                    rounded
                    titleStyle={STYLES.textWithShadow}
                    title="Sandip"
                
                // activeOpacity={0.7}  
                >
                    <TouchableBox
                        style={STYLES.addImageIcon}
                        onPress={addOrEditImage}
                    >
                        {
                            isEmpty( UserProfileStore.userData.PhotoPath )
                                ? <Icon name="add" size={25} color="#FFF" />
                                : <Icon name="edit" size={25} color="#FFF" />
                        }
                    </TouchableBox>
                </Avatar>
    
            )
            

        }
    
    }

    const onSave = async ( ) => {
        const fetchAllFilterData = useCallback( async () => {
         
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
            } as IuserProfileSavaPayload
            await UserProfileStore.SaveUserProfile( payload )
    
        }, [] )
    
    }
    const Oncancel = async ( ) => {
        Alert.alert(
            "Cancel Editable data",
            "Are you sure?",
            [
                {
                    text: "No",
                    onPress: () => null
                },
                {
                    text: "Yes",
                    onPress: async ( ) => {
                        fetchData()
                    }
                }
            ],
        );
        return true
    }


    return (
        <Box flex={.88}>
            <FormHeader 
                title={"Profile"}
                navigation={navigation}
            />
            <ScrollView contentContainerStyle={STYLES.contentContainerStyle} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
                <Box height='15%' justifyContent={'center'} alignItems={'center'} my={'regular'}>{
                    loadAvtar()
                }
                
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
                                : <Box mx="medium">
                                    <Input 
                                        label={<LabelWithAsterisk label="Area Manager:" />}
                                        placeholder="Click Here"
                                        value={UserListByCompanyStore.selectedUser?.FullName ?? UserProfileStore.userData.Supervisor}
                                        onTouchStart={UserListByCompanyStore.displaySearchableModal}
                                        editable={editabelflag}
                                    />
                                </Box>
                        }
                        <Input 
                            label="First name"
                            placeholder="First Name"
                            value={UserProfileStore.userData.FirstName}
                            // editable={editabelflag}
                            onChangeText={ ( text )=>UserProfileStore.setFirstName( text ) }


                        />

                        <Input
                            label="Last name"
                            placeholder="Last Name"
                            value={UserProfileStore.userData.LastName}
                            editable={editabelflag}
                            onChangeText={ ( text )=>UserProfileStore.setLastName( text ) }

                        />
                        <Input
                            label="Email Address:"
                            placeholder="Email Address"
                            value={UserProfileStore.userData.EmailAddress}
                            editable={editabelflag}
                            onChangeText={ ( text )=>UserProfileStore.setEmailAddress( text ) }

                        />
                        <Input
                            label="Phone:"
                            placeholder="Phone"
                            value={UserProfileStore.userData.Phone}
                            editable={editabelflag}
                            onChangeText={ ( text ) =>UserProfileStore.setPhone( text ) }

                        />
                    
                        <Input 
                            label="Address"
                            placeholder="Address"
                            value={UserProfileStore.userData.Address}
                            editable={editabelflag}
                            onChangeText={ ( text ) =>UserProfileStore.setAddress( text ) }

                        />
                        <Input
                            label="City:"
                            placeholder="City"
                            value={UserProfileStore.userData.City}
                            editable={editabelflag}
                            onChangeText={ ( text ) =>UserProfileStore.setCity( text ) }

                        />

                        <Input
                            label="State:"
                            placeholder="State"
                            value={UserProfileStore.userData.State}
                            editable={editabelflag}
                            onChangeText={ ( text ) =>UserProfileStore.setState( text ) }

                        />
                        <Input
                            label="Zip Code:"
                            placeholder="Zip Code"
                            defaultValue={UserProfileStore.userData.Zip}
                            editable={editabelflag}
                            onChangeText={ ( text ) =>UserProfileStore.setZip( text ) }

                        />


                        <Input
                            label="Country:"
                            placeholder="Country"
                            value={UserProfileStore.userData.Country}
                            editable={editabelflag}
                            onChangeText={ ( text ) =>UserProfileStore.setZCountry( text ) }

                        
                        />
                    </Box>
                  
                </Box>
                <Box flex={0.12}>
                    <Box flexDirection="row">
                        <Box width={"50%"}>
                            <Button
                                title="Save"
                                onPress={onSave}
                            />
                        </Box>
                        <Box width="50%">
                            <Button 
                                title="Close"
                                onPress={Oncancel}
                            />
                        </Box>
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
    )
} )
