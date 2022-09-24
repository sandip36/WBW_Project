

import { useFocusEffect, useNavigation } from "@react-navigation/core"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ActivityIndicator, BackHandler, Button, Image, ImageStyle, Platform, ScrollView, StyleProp, ViewStyle } from "react-native"
import { makeStyles, theme } from "theme"
import { useRoute } from "@react-navigation/native";
import { FormHeader } from "components/core/header/form-header";
import { Box, Input, SecureInput, Text, TextAreaInput } from "components";
import { Dropdown } from "components/core/dropdown";
import { useStores } from "models";
import { IuserProfilePayload } from "services/api";
import { useKeyboard } from "@react-native-community/hooks"
import { LabelWithAsterisk } from "screens/observation";
import { AuditDetailsRow } from "components/audit-detail-row/audit-details-row";
import { Avatar } from "react-native-elements";
import { isEmpty } from "lodash";




export type UserProfileScreenProps = {
    url: string
    tital:string
}

export type UserProfileStyleProps = {
  containerStyle: StyleProp<ViewStyle>
}

// const useStyles = makeStyles<UserProfileStyleProps>( ( theme ) => ( {
//     containerStyle: { width: '100%', height: '100%' },
// } ) )

const useStyles = makeStyles<{
    keyboardStyle: StyleProp<ViewStyle>;imageStyle: StyleProp<ImageStyle>, inputContainerStyle: StyleProp<ViewStyle>, contentContainerStyle: StyleProp<ViewStyle>
}>( ( theme ) => ( {
    imageStyle: {
        width: '95%',
        // Without height undefined it won't work
        height:"50%"
        // backgroundColor:"red",
        // figure out your image aspect ratio
        // aspectRatio: 135 / 40,
    },
    
    inputContainerStyle: {
        borderBottomWidth: 1,
        borderColor: theme.colors.primary
    },
    contentContainerStyle: {
        flexGrow: 1,
        paddingBottom: 30
    }, keyboardStyle:{
        height: Platform.OS === 'ios' ? '30%' : '2%' 
    }
} ) )

export const UserProfile: React.FunctionComponent<UserProfileScreenProps> = ( props ) => {
    const route = useRoute()
    const { UserProfileStore,AuthStore } = useStores()  
    const navigation = useNavigation()
    const STYLES = useStyles()
    const keyboard = useKeyboard()
    const [ imgUrl, setImgUrl ] = useState( '' )


    useFocusEffect(
        React.useCallback( () => {
            fetchUserProfile()
        }, [] )
    );


    const fetchUserProfile = useCallback( async () => {
        await UserProfileStore._clear

        const payload = {
            UserID: AuthStore?.user.UserID,
            AccessToken: AuthStore?.token,
        } as IuserProfilePayload
        await UserProfileStore.fetch( payload )
    }, [] )


    // useEffect( () => {
    //     const backHandler = BackHandler.addEventListener(
    //         "hardwareBackPress",
    //         _handleBackPress
    //     );
    //     return () => backHandler.remove();
    // }, [] )

    useEffect( ( ) => {
        fetchUserProfileImg()

    }, [] )


    const fetchUserProfileImg =()=>{
        let formattedUrl = `${AuthStore.environment.api.apisauce.getBaseURL()}${UserProfileStore.userData.PhotoPath}`
        formattedUrl = formattedUrl.replace( "/MobileAPI/api", "" )

        console.log( "formaUserProfileStore.userData.PhotoPathttedUrl",UserProfileStore.userData.PhotoPath )

        console.log( "formattedUrl",formattedUrl )
        console.log( "AuthStore.environment.api.apisauce.getBaseURL()",AuthStore.environment.api.apisauce.getBaseURL() )
        setImgUrl( formattedUrl )

        // if( isEmpty( UserProfileStore.userData.PhotoPath ) ){
        //     setImgUrl( 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg' )
        // }else{
        //     setImgUrl( formattedUrl )
        // }

    }

    // const _handleBackPress = ( ) => {
    //     // Works on both iOS and Android
    //     // eslint-disable-next-line no-empty
       
    //     navigation.goBack()
    //     return true
    // }


    return (
        <Box flex={1}>
            <FormHeader 
                title={"Profile"}
                navigation={navigation}
            />
            <ScrollView contentContainerStyle={STYLES.contentContainerStyle} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
              
                <Box height='15%' justifyContent={'center'} alignItems={'center'} my={'regular'} >
                    <Avatar 
                        size={'xlarge'}
                        rounded
                        source={{
                            uri:imgUrl                        }}
                        onPress={() => console.log( "Works!" )}
                        activeOpacity={0.7}
                
                    />
                </Box>
                <Box mx="small">
                    {/* <TextAreaInput 
                        label={<LabelWithAsterisk label="User ID:" />}
                        labelStyle={{ color: theme.colors.primary, fontSize: theme.textVariants.heading5?.fontSize  }}
                        placeholder="Type Here"
                        onChangeText={handleChange( "observation" )}
                        onBlur={handleBlur( "observation" )}
                        error={touched.observation && errors.observation}
                    />  */}
                    {/* <Image 
                        source={{ uri: UserProfileStore.userData.PhotoPath }}
                        style={STYLES.imageStyle}
                        resizeMode="contain"
                    />  */}
                    <AuditDetailsRow 
                        title= "User ID: " 
                        value={UserProfileStore.userData.LoginName} 
                    />
                    <AuditDetailsRow
                        title= "User Code: " 
                        value={UserProfileStore.userData.UserCode} 
                    />
                    <Box my={'regular'}>

                        <Input 
                            label="First name"
                            placeholder="First Name"
                            value={UserProfileStore.userData.FirstName}
                        
                            // onChangeText={handleChange( "username" )}
                            // onBlur={handleBlur( "username" )}
                            // error={touched.username && errors.username}
                        />

                        <Input
                            label="Last name"
                            placeholder="Last Name"
                            value={UserProfileStore.userData.LastName}
                            // onChangeText={handleChange( "username" )}
                            // onBlur={handleBlur( "username" )}
                            // error={touched.username && errors.username}
                        />
                        <Input
                            label="Email Address:"
                            placeholder="Email Address"
                            value={UserProfileStore.userData.EmailAddress}
                            // onChangeText={handleChange( "username" )}
                            // onBlur={handleBlur( "username" )}
                            // error={touched.username && errors.username}
                        />
                        <Input
                            label="Phone:"
                            placeholder="Phone"
                            value={UserProfileStore.userData.Phone}
                            // value={values.username}
                            // onChangeText={handleChange( "username" )}
                            // onBlur={handleBlur( "username" )}
                            // error={touched.username && errors.username}
                        />
                    
                        <Input
                            label="Default Level:"
                            placeholder="Default Level"
                            value={UserProfileStore.userData.LevelName}
                        // onChangeText={handleChange( "username" )}
                            // onBlur={handleBlur( "username" )}
                            // error={touched.username && errors.username}
                        />
                        <Input
                            label="Department:"
                            placeholder="Department"
                            value={UserProfileStore.userData.DepartmentName}
                            // onChangeText={handleChange( "username" )}
                            // onBlur={handleBlur( "username" )}
                            // error={touched.username && errors.username}
                        />
                        {/* <Dropdown
                        title="Inspection on behalf of"
                        items={AuditStore.secondaryList}
                        isRequired={true}
                        value={AuditStore.currentSecondaryListID}
                        onValueChange={( value )=>AuditStore.setCurrentSecondaryListID( value )}
                    /> */}<Input 
                            label="Address"
                            placeholder="Address"
                            value={UserProfileStore.userData.Address}
                
                            // onChangeText={handleChange( "username" )}
                            // onBlur={handleBlur( "username" )}
                            // error={touched.username && errors.username}
                        />
                        <Input
                            label="City:"
                            placeholder="City"
                            value={UserProfileStore.userData.City}
                            // onChangeText={handleChange( "username" )}
                            // onBlur={handleBlur( "username" )}
                            // error={touched.username && errors.username}
                        />

                        <Input
                            label="State:"
                            placeholder="State"
                            value={UserProfileStore.userData.State}
                            // value={values.username}
                            // onChangeText={handleChange( "username" )}
                            // onBlur={handleBlur( "username" )}
                            // error={touched.username && errors.username}
                        />

                        <Input
                            label="Country:"
                            placeholder="Country"
                            value={UserProfileStore.userData.Country}
                            // value={values.username}
                            // onChangeText={handleChange( "username" )}
                            // onBlur={handleBlur( "username" )}
                            // error={touched.username && errors.username}
                        />

                        <Input
                            label="Zip Code:"
                            placeholder="Zip Code"
                            value={UserProfileStore.userData.Zip}
                            // value={values.username}
                            // onChangeText={handleChange( "username" )}
                            // onBlur={handleBlur( "username" )}
                            // error={touched.username && errors.username}
                        />

               
                   


                        {/* <Box mx="negative8">
                        <Dropdown
                            title="Base URL"
                            items={BUILD_BASE_URL}
                            value={AuthStore.baseUrl}
                            onValueChange={( value )=>AuthStore.setBaseUrl( value )}
                        />
                        <Box
                 */}
                
                        {/* <SecureInput
                    label="Password"
                    placeholder="Password"
                    // value={values.password}
                    // onChangeText={handleChange( "password" )}
                    // onBlur={handleBlur( "password" )}
                    // error={touched.password && errors.password}
                /> */
                        }
                        {/* <Box mx="negative8">
                    <Dropdown
                        title="Base URL"
                        items={BUILD_BASE_URL}
                        value={AuthStore.baseUrl}
                        onValueChange={( value ) => AuthStore.setBaseUrl( value )}
                    />
                </Box> */}
                    </Box>
                    {/* <Box mt="medium">
                <Button
                    title="Submit"
                    onPress={}
                    // disabled={!isValid || isValidating || isSubmitting}
                    // loading={isValidating || isSubmitting}
                />
            </Box> */}
                </Box>
                <Box flex={1} justifyContent="center" >
                    <Text variant="body" pl="medium" color="primary">Logout</Text>
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
}
