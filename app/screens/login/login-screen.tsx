import React from "react"
import { Box, Text, Input, SecureInput, Button } from "components"
import { Dimensions, Image, ImageStyle, ScrollView, StyleProp, ViewStyle } from "react-native"
import { makeStyles, useTheme } from "theme"
import { useFormik } from "formik"
import { string, object } from 'yup'
import { useStores } from "models"
import { ILoginPayload } from "services/api"
import { Dropdown } from "components/core/dropdown"
import { observer } from "mobx-react-lite"
import DeviceInfo from 'react-native-device-info';
import { loadString } from "utils/storage"



export type LoginScreenProps = {

}

const BUILD_BASE_URL = [
    {
        label: "Unit test - Demo",
        value: "http://198.71.63.116/Demo/MobileAPI/api"
    },
    {
        label: "Unit test -Sandbox",
        value: "http://198.71.63.116/MySite/MobileAPI/api"
    },
    {
        label: "Demo",
        value: "https://demo.wisebusinessware.com/MobileAPI/api"
    },
    {
        label: "Sandbox",
        value: "https://sandbox.wisebusinessware.com/MobileAPI/api"
    },
    {
        label: "Production",
        value:"https://mysite.wisebusinessware.com/MobileAPI/api"
    }
]


const useStyles = makeStyles<{imageStyle: StyleProp<ImageStyle>, inputContainerStyle: StyleProp<ViewStyle>, contentContainerStyle: StyleProp<ViewStyle>}>( ( theme ) => ( {
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
    }
} ) )

export const LoginScreen: React.FunctionComponent<LoginScreenProps> = observer( ( props ) => {
    const theme = useTheme()
    const STYLES = useStyles()
    const { AuthStore } = useStores()
   

    const {
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        errors,
        isValid,
        values,
        isValidating,
        isSubmitting,
        resetForm,
    } = useFormik( {
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: object( {
            username: string()
                .required(),
            password: string()
                .required()
                .min( 1 )
        } ),
        async onSubmit ( values ) {

            const deviceId = DeviceInfo.getDeviceId();
            const TOKEN = await loadString( "TOKEN" )

            const payload = {
                UserName: values.username,
                Password: values.password,
                DeviceToken: TOKEN,
                DeviceType: deviceId
            }
            await AuthStore.setBaseUrl( AuthStore.baseUrl )
            await AuthStore.setregistredtoken( TOKEN )
            await AuthStore.login( payload as ILoginPayload )
        },
    } )

    return (
        <Box flex={1} bg="white">
            <ScrollView  contentContainerStyle={STYLES.contentContainerStyle} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
                <Box flex={0.49}  mt="huge" mb="medium" alignItems="center" justifyContent="center">
                    <Image 
                        source={theme.assets.livelogo}
                        style={STYLES.imageStyle}
                    />
                </Box>
                <Box mb="medium" mt="huge"  justifyContent="center" alignItems="center" >
                    <Text fontSize={theme.typography.large} textAlign="center" fontWeight="bold" mt="negative8" mb="medium"> Login </Text>
                </Box>
                <Box mx="small" mt="massive">
                    <Input 
                        label="Username"
                        placeholder="Username"
                        value={values.username}
                        onChangeText={handleChange( "username" )}
                        onBlur={handleBlur( "username" )}
                        error={touched.username && errors.username}
                    />
                    <SecureInput 
                        label="Password"
                        placeholder="Password"
                        value={values.password}
                        onChangeText={handleChange( "password" )}
                        onBlur={handleBlur( "password" )}
                        error={touched.password && errors.password}
                    />
                    <Box mx="negative8">
                        <Dropdown
                            title="Base URL"
                            items={BUILD_BASE_URL}
                            value={AuthStore.baseUrl}
                            onValueChange={( value )=>AuthStore.setBaseUrl( value )}
                        />
                    </Box>
                </Box>
                <Box mt="medium">
                    <Button 
                        title="Login"
                        onPress={handleSubmit}
                        disabled={!isValid || isValidating || isSubmitting}
                        loading={isValidating || isSubmitting}
                    />
                </Box>

                
            </ScrollView>
        </Box>
    )
} )
