import { StackActions, useNavigation, useRoute } from "@react-navigation/native"
import { Box } from "components"
import React, {  useRef, useState } from "react"
import { makeStyles } from "theme"
import {  Icon } from "react-native-elements"
import { RNCamera } from "react-native-camera"
import { Platform, StyleProp, ViewStyle } from "react-native"
import { Asset, ImageLibraryOptions, launchImageLibrary } from "react-native-image-picker"
import Toast from "react-native-simple-toast"
import { IImages } from "models"


export type CaptureTaskImageScreenProps = {

}
export type CaptureTaskImageScreenStyleProps = {
    RNCamerContainerStyle: StyleProp<ViewStyle>,
    avatarContainerStyle: StyleProp<ViewStyle>
}

const useStyles = makeStyles<CaptureTaskImageScreenStyleProps>( ( theme ) => ( {
    RNCamerContainerStyle: {
        flex: 1
    },
    avatarContainerStyle: {
        backgroundColor: theme.colors.primary
    }
} ) )

export const CaptureTaskImageScreen: React.FC<CaptureTaskImageScreenProps> = ( ) => {
    const route = useRoute()
    const {
        callback
    } = route.params as any
    const IMAGE_OPTIONS = {
        mediaType: 'photo',
        quality: 0.7,
        includeBase64: false
    } as ImageLibraryOptions
    const navigation = useNavigation()
    const STYLES = useStyles()
    const camera = useRef<any>()
    const [ cameraType, setCameraType ] = useState( "back" )

    
    function toggleCameraType () {
        setCameraType( cameraType === "front" ? "back" : "front" )
    }

    async function takePicture () {
        const imageDetails = await camera.current.takePictureAsync( {
            quality: 0.5,
            fixOrientation: Platform.OS === 'android'
        } )
        const IMAGE_OBJECT = {
            height: imageDetails.height,
            width: imageDetails.width,
            types: "",
            fileName: "",
            fileSize: 0,
            uri: imageDetails.uri
        } as IImages
        callback( IMAGE_OBJECT )
        navigation.dispatch( StackActions.pop( 1 ) )
        // navigation.goBack()
    }
    const selectPicture = async ( ) => {
        const result = await launchImageLibrary( IMAGE_OPTIONS )
        if( result.didCancel ) {
            navigation.dispatch( StackActions.pop( 1 ) )
            // navigation.goBack()
            return null
        }else if( result.errorCode ) {
            Toast.showWithGravity( result.errorMessage || 'Something went wrong while picking image', Toast.LONG, Toast.CENTER )
            navigation.dispatch( StackActions.pop( 1 ) )
            // navigation.goBack()
            return null
        }else{
            const imageDetails = result.assets[0] as Asset
            const IMAGE_OBJECT = {
                height: imageDetails.height,
                width: imageDetails.width,
                types: imageDetails.type,
                fileName: imageDetails.fileName,
                fileSize: imageDetails.fileSize,
                uri: imageDetails.uri
            } as IImages
            callback( IMAGE_OBJECT )
            navigation.dispatch( StackActions.pop( 1 ) )
            // navigation.goBack()
        }
    }



    return (
        <Box flex={1}>
            <RNCamera ref={camera} style={STYLES.RNCamerContainerStyle} type={cameraType as any}>
                <Box flex={1} position="absolute" top={10} left={0} bottom={0} right={0} justifyContent="space-between" flexDirection={"column"}>
                    <Box flex={1} flexDirection="row" justifyContent={"space-around"} alignItems="flex-end" py="regular" mb="huge">
                        <Icon name="repeat" color="white" size={48} onPress={toggleCameraType} />
                        <Icon name="camera" color="white" size={48} onPress={takePicture} />
                        <Icon name="image" color="white" size={48} onPress={selectPicture} />
                    </Box>
                </Box>    
            </RNCamera>
        </Box>
    )
}