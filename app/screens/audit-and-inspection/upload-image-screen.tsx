import { useNavigation, useRoute } from "@react-navigation/native"
import { Box, Button } from "components"
import { IImages, useStores } from "models"
import React, { useEffect } from "react"
import { RenderImage } from "components/inspection"
import { makeStyles } from "theme"
import { Avatar } from "react-native-elements"
import { Alert, BackHandler, FlatList, ImageStyle, StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import Toast from "react-native-simple-toast"
import { imageUpload, uploadAllImages } from "utils/fetch_api"


export type UploadImageScreenProps = {

}
export type UploadImageStyleProps = {
    imageStyle: StyleProp<ImageStyle>,
    avatarContainerStyle: StyleProp<ViewStyle>
}

const useStyles = makeStyles<UploadImageStyleProps>( ( theme ) => ( {
    imageStyle: {
        width: 150,
        height: 150,
        borderRadius: theme.borderRadii.medium,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    avatarContainerStyle: {
        backgroundColor: theme.colors.primary
    }
} ) )


export const UploadImageScreen: React.FC<UploadImageScreenProps> = observer( ( props ) => {
    const route = useRoute()
    const {
        attributeData
    } = route.params as any
    const navigation = useNavigation()
    const STYLES = useStyles()
    const { AuthStore, AuditStore } = useStores()

    const deleteImage = async ( index: number ) => {
        await attributeData.removeImageByIndex( index )
    }

    const renderImages = ( { item, index } : {item: IImages, index: number } ) => {
        return (
            <Box flex={1} justifyContent="center" alignItems="center">
                <RenderImage 
                    image={item}
                    style={STYLES.imageStyle}
                    deleteImage={( ) => deleteImage( index )}
                />
            </Box>
        )
    }

    const ItemSeparatorComponent = ( ) => {
        return (
            <Box height={20} />
        )
    }

    useEffect( () => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            _handleBackPress
        );
        return () => backHandler.remove();
    }, [] )

    const _handleBackPress = ( ) => {
        // Works on both iOS and Android
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
                    onPress: async ( ) => {
                        await attributeData.removeImages()
                        navigation.pop( 2 )
                    }
                }
            ],
        );
        return true
    }


    const onSave = async ( ) => {
        if( attributeData.auditImage.length > 0 ) {
            const finalUrl = `AuditAndInspection/UploadAttributesInstanceImage?UserID=${AuthStore.user?.UserID}&AuditAndInspectionID=${AuditStore.inspection?.AuditAndInspectionDetails?.AuditAndInspectionID}&CustomForm_Attribute_InstanceID=${attributeData.CustomForm_Attribute_InstanceID}`
            const response = await uploadAllImages( {
                images: attributeData.auditImage,
                url: finalUrl
            } )
            navigation.pop( 2 )
        }else{
            console.log( 'no data found' )
        }
    }
    const onCancel = ( ) => {
        navigation.pop( 2 )
    }

    const addImages = ( ) => {
        navigation.goBack()
    }

    return (
        <Box flex={1}>
            <Box flex={0.9}>
                <Box mt="huge">
                    <FlatList 
                        data={attributeData.auditImage}
                        renderItem={renderImages}
                        ItemSeparatorComponent={ItemSeparatorComponent}
                    />
                </Box>

                {
                    attributeData.auditImage?.length < 4
                        ? <Box position="absolute" bottom={20} right={10}>
                            <Avatar size="medium" onPress={addImages} rounded icon={{ name: 'add' }} containerStyle={STYLES.avatarContainerStyle}/>
                        </Box>
                        : null
                }
            </Box>
            <Box flex={0.1}>
                <Box flexDirection="row">
                    <Box width={"50%"}>
                        <Button
                            title="Save"
                            onPress={onSave}
                        />
                    </Box>
                    <Box width="50%">
                        <Button 
                            title="Cancel"
                            onPress={_handleBackPress}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
} )