import { Box, InputWithIcon, Text, TextAreaInput, TouchableBox } from "components"
import React, { useEffect, useState } from "react"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { AuditStore, IAttributes, IAtttributeImages, IAudit, IImages, useStores } from "models"
import { FlatList, ImageStyle, StyleProp, ViewStyle, Modal, TouchableOpacity, View, Dimensions, Alert } from "react-native"
import { makeStyles, theme } from "theme"
import { Dropdown } from "components/core/dropdown"
import { ImageLibraryOptions } from "react-native-image-picker"
import { Observer, observer } from "mobx-react-lite"
import { Avatar, Icon, Image } from "react-native-elements"
import { isEmpty } from "lodash"
import { Item } from "react-native-picker-select"
import { IDeleteAttributeImages } from "services/api"
import ImageViewer from "react-native-image-zoom-viewer"
import { LabelWithAsterisk } from "screens"

export type GroupsAndAttributesProps = {
    groupId: string
}
export type ScoreDropdownProps = {
    item: IAttributes
}

const ItemSeparatorComponent = ( ) => {
    return (
        <Box height={24} />
    )
}

const useStyles = makeStyles<{contentContainerStyle: StyleProp<ViewStyle>, imageStyle: StyleProp<ImageStyle>, avatarContainerStyle: StyleProp<ViewStyle>, modalContainerStyle: StyleProp<ViewStyle>}>( ( theme ) => ( {
    contentContainerStyle: {
        paddingBottom: theme.spacing.extraLarge
    },
    imageStyle: {
        width: 100,
        height: 100,
        borderRadius: theme.borderRadii.medium,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    avatarContainerStyle: {
        backgroundColor: theme.colors.primary
    },
    modalContainerStyle: {
        flex: 1
    }
} ) )

export type RenderImageProps = {
    image: IImages,
    style?: StyleProp<ImageStyle>,
    deleteImage?: ( ) => void,
    customUri?: string,
    showDeleteIcon?: boolean,
    onImagePress?: ( ) => void
}

export type RenderHazardProps = {
    data: IAttributes,
    items: Item[],
    onValueChange: ( value: any, index: number ) => any,
}
export type RenderAttributeImagesProps = {
    attributeData: IAttributes
}

export const RenderImage: React.FunctionComponent<RenderImageProps> = observer( ( props ) => {
    const { image, style, deleteImage, customUri, showDeleteIcon = true, onImagePress } = props
    const shouldImageBePressed = onImagePress || ( ( ) => null )
    return (
        <TouchableBox flex={1} bg="transparent" flexDirection="row" onPress={shouldImageBePressed}>
            <Box>
                <Image
                    source={{ uri: image?.uri || customUri }}
                    // source={{ uri: `http://198.71.63.116/Demo/WorkflowUpload\\AuditAndInspectionFiles\\2455_0c97ad7b-1cea-47ea-850e-25561afbdaa3.jpg` }}
                    style={style}
                />
            </Box>
            {
                showDeleteIcon
                    ? <Box position={"absolute"} right={3} top={3}>
                        <Avatar size="small" onPress={deleteImage} rounded icon={{ name: 'delete' }} 
                            containerStyle={{ backgroundColor: theme.colors.primary }}
                        />
                    </Box>
                    : null
            }
        </TouchableBox>
    )
} )

export const RenderHazard: React.FunctionComponent<RenderHazardProps> = ( props ) => {
    const { data, items, onValueChange } = props
    const { AuditStore } = useStores()
    const showHazard = AuditStore.shouldShowHazard( data.DoNotShowHazard )
    if( showHazard && AuditStore.inspection.GroupsAndAttributes?.HazardList.length > 0
        && data.checkForTruthyValues ? Number( data.GivenAnswerID ) !== Number( data.CorrectAnswerID )
        : Number( data.GivenAnswerID ) <= Number( data.CorrectAnswerID ) ) {
        return (
            <Box flex={1}>
                <Text>Hazards Shown</Text>
                <Dropdown
                    title="Hazard"
                    isRequired={true}
                    items={items}
                    value={data.HazardsID}
                    onValueChange={onValueChange}
                />
            </Box>
        )
    }else{
        return <Text>ELSE BLOCK</Text>
    }
}

export const ScoreDropdown: React.FunctionComponent<ScoreDropdownProps> = ( props ) => {
    ScoreDropdown.displayName = "ScoreDropdown"
    const {
        item
    } = props
    const { AuditStore } = useStores()
    const [ scoreValue, setScoreValue ] = useState( item.GivenAnswerID )

    // useEffect( ( ) => {
    //     onCheckboxValueChange()
    // }, [ AuditStore.isPassingValuesSelected ] )

    // const onCheckboxValueChange = ( ) => {
    //     if( !AuditStore.isPassingValuesSelected ) {
    //         if( item.GivenAnswerID !== "0" || item.GivenAnswerID !== null || item.GivenAnswerID !== undefined ) {
    //             setScoreValue( item.GivenAnswerIDClone )
    //         }
    //         else{
    //             setScoreValue( "0" )
    //         }
    //     }else{
    //         if( item.GivenAnswerID === "0" || item.GivenAnswerID === null || item.GivenAnswerID === undefined ) {
    //             setScoreValue( item.MaxCorrectAnswerID )                
    //         }else{
    //             setScoreValue( item.GivenAnswerID )
    //         }
    //     }
    // }

    const onScoreValueChange = ( value ) => {
        if( isEmpty( value ) ) {
            return null
        }
        if( value !== scoreValue ) {
            setScoreValue( value )
            item.setGivenAnswerId( value )
        }  
    }

    return (
        <Box>
            <Dropdown
                title={AuditStore?.inspection?.AuditAndInspectionDetails?.ScoringLable}
                items={AuditStore.getDropdownData( item.ScoreList )}
                value={AuditStore.isPassingValuesSelected === true && Number( item.GivenAnswerID ) === 0  ? item.MaxCorrectAnswerID : item.GivenAnswerID }
                onValueChange={onScoreValueChange}
                isRequired={true}
            />
        </Box>
    )
}

export const RenderAttributeImages: React.FunctionComponent<RenderAttributeImagesProps> = observer( ( props ) => {
    const { attributeData } = props
    const STYLES = useStyles()
    const { AuthStore, AuditStore } = useStores()
    const [ refresh,setRefresh ] = useState( false )
    const [ showZoomViewer,setShowZoomViewer ] = useState( false )

    const onDeleteImage = async ( item: IAtttributeImages, index: number ) => {
        Alert.alert(
            "Delete Image?",
            "Are you sure you want to delete image?",
            [
                {
                    text: "No",
                    onPress: () => null
                },
                {
                    text: "Yes",
                    onPress: async ( ) => {
                        const payload = {
                            UserID: AuthStore.user?.UserID,
                            AccessToken: AuthStore.token,
                            CustomForm_Attribute_Instance_ImageID: item?.CustomForm_Attribute_Instance_ImageID
                        } as IDeleteAttributeImages
                        await AuditStore.deleteImageFromServer( payload )
                        await attributeData.removeAttributeImageByIndex( index )
                        setRefresh( !refresh )
                    }
                }
            ],
        );
        return true
       
    }

    const onImagePress = ( ) => {
        setShowZoomViewer( true )
    }


    const renderImageItem = ( { item, index } ) => {
        let formattedUrl = `${AuthStore.environment.api.apisauce.getBaseURL()}${item.FilePath}`
        formattedUrl = formattedUrl.replace( "/MobileAPI/api", "" )
        return (
            <Box flex={1} flexDirection="row" marginHorizontal="medium">
                <RenderImage 
                    image={item}
                    customUri={`${formattedUrl}`}
                    style={STYLES.imageStyle as StyleProp<ImageStyle>}
                    showDeleteIcon={true}
                    deleteImage={()=>onDeleteImage( item, index )}
                    onImagePress={onImagePress}
                />
            </Box>
        )
    }

    const onRequestClose = ( ) => {
        console.log( 'on request close' )
        setShowZoomViewer( false )
    }

    console.log( attributeData.attributeImageForZoom( AuthStore.environment.api.apisauce.getBaseURL() ) )

    return (
        <Box flex={1} flexDirection="row" marginHorizontal="regular">
            {
                showZoomViewer 
                    ? <Modal 
                        style={STYLES.modalContainerStyle}
                        visible={showZoomViewer}
                        onRequestClose={onRequestClose}
                    >
                        <ImageViewer
                            imageUrls={attributeData.attributeImageForZoom( AuthStore.environment.api.apisauce.getBaseURL() ) as any}
                            index={0}
                        />
                        <Box position="absolute" top={20} right={10}>
                            <Avatar size="medium" onPress={onRequestClose} rounded icon={{ name: 'close' }} containerStyle={STYLES.avatarContainerStyle}/>
                        </Box>
                    </Modal>
                    : <FlatList 
                        data={attributeData.AttributeImages}
                        extraData={refresh}
                        keyExtractor={( item,index ) => String( index ) }
                        renderItem={renderImageItem}
                        horizontal={true}
                    /> 
            }
        </Box>
    )
} )

export const GroupsAndAttributes: React.FunctionComponent<GroupsAndAttributesProps> = observer( ( props ) => {
    const {
        groupId
    } = props
    const navigation = useNavigation()
    const IMAGE_OPTIONS = {
        mediaType: 'photo',
        quality: 0.7,
        includeBase64: false
    } as ImageLibraryOptions
    const STYLES = useStyles()
    const { AuditStore, TaskStore, AuthStore } = useStores()
    const [ refreshing, setRefreshing ] = useState( false )

    useFocusEffect(
        React.useCallback( () => {
            refreshGroupsAndAttributes()
        }, [ AuditStore.refreshInspectionImage ] )
    );

    const refreshGroupsAndAttributes = ( ) => {
        setRefreshing( !refreshing )
    }

    // useEffect( ( ) => {
    //     console.log( 'Inside useEffecrt' )
    //     setRefreshing( !refreshing )
    // }, [ AuditStore.refreshInspectionImage ] )

    const onCallback = ( value ) => {
        setRefreshing( !refreshing )
    }
    
    const imagePressHandler = async ( item: IAttributes ) => {
        navigation.navigate( 'CaptureImage', {
            attributeData: item,
            // callback: ( value ) => onCallback( value )
        } )
    }

    const deleteTaskImage = async ( ) => {
        await TaskStore.removeTaskImage( )
    }

    const updateHazard = async ( item: IAttributes ) => {
        await item.setHazardId( item.HazardsIDClone )
        setRefreshing( refreshing => !refreshing )
    }

    const navigateToAssignOrCompleteTask = async ( item: IAttributes ) => {
        if( item.HazardsID !== item.HazardsIDClone ) {
            await TaskStore.setAttributeID( item.AttributeID )
            await TaskStore.setCustomFormResultID( item.CustomFormResultID )
            await TaskStore.setCurrentHazardId( item.HazardsID )
            await TaskStore.setCurrentTitle( item.Title )
            navigation.navigate( 'CompleteOrAssignTask', {
                callback: ( ) => updateHazard( item ),
                attributeData: item
            } )
        }
    }

    const clearHazards = ( item: IAttributes ) => {
        item.setIsHazardRequired( false )
        item.setHazardId( "0" )
        return null
    }

    const showHazard = ( item: IAttributes ) => {
        item.setIsHazardRequired( true )
        return (
            <Box flex={1}>
                <Dropdown
                    title="Hazard"
                    items={AuditStore.hazardList}
                    value={item.HazardsID}
                    isRequired={true}
                    onValueChange={( value )=>{
                        if( !isEmpty( value ) ){
                            item.setHazardId( value )
                            navigateToAssignOrCompleteTask( item )
                        }
                    }}
                />
            </Box>
        )
    }   

    const checkForMultipleCorrectAnswers = ( item: IAttributes ) => {
        let correctAnswerID = item.CorrectAnswerID
        let correctAnswerIDs = []
        correctAnswerID = correctAnswerID.replace( " or ", "," )
        correctAnswerIDs = correctAnswerID.split( "," )
        const result = !correctAnswerIDs.includes( item.GivenAnswerID )
        console.log( 'result  for multiple',result )
        return result
    }

    const renderItem = ( { item }: {item:IAttributes } ) => {
        return (
            <Observer>
                {
                    ( ) => (
                        <Box flex={1}>
                            <Box marginHorizontal="regular">
                                <Text variant="heading4" marginHorizontal="medium" fontWeight="bold">{item.AttributeOrder}. {item.Title}</Text>
                            </Box>
                            {
                                item.AuditAndInspectionScoreID === "6"
                                    ? null
                                    : 
                                    <ScoreDropdown 
                                        item={item}
                                    />
                            }
                            {
                                AuditStore.shouldShowSourceList && item.AuditAndInspectionScoreID !== "6"
                                    ? <Dropdown
                                        title="Source"
                                        items={AuditStore.sourceList}
                                        value={item.SourceID}
                                        onValueChange={( value )=>item.setSourceId( value )}
                                    />
                                    : null
                            }
                            {
                                item.currentGivenAnswerID === "0" || isEmpty( item.currentGivenAnswerID )
                                    ? null
                                    : (
                                        AuditStore.shouldShowHazard( item.DoNotShowHazard ) 
                                && AuditStore.inspection.GroupsAndAttributes?.HazardList.length > 0
                                && ( item.checkForTruthyValues 
                                    ? item.CorrectAnswerID.includes( "or" )
                                        ? checkForMultipleCorrectAnswers( item )
                                        : Number( item.GivenAnswerID ) !== Number( item.CorrectAnswerID )
                                    : Number( item.GivenAnswerID ) < Number( item.CorrectAnswerID ) )
                                            ? 
                                            showHazard( item )
                                            : clearHazards( item )
                                            
                                    )
                            }
                            {
                                (
                                    <Box marginHorizontal="regular" mt="regular">
                                        <TextAreaInput 
                                            // label={item.commentsMandatoryOrNot}
                                            label={item.commentsMandatoryOrNot === "Comments *" ? <LabelWithAsterisk label="Comments" /> : "Comments" }
                                            labelStyle={{ color: theme.colors.primary, fontSize: theme.textVariants.heading5?.fontSize  }}
                                            placeholder="Comments"
                                            defaultValue={item.Comments}                        
                                            onChangeText={ ( text ) => item.setComments( text ) }
                                        /> 
                                    </Box>
                                ) 
                            }
                            <TouchableBox marginHorizontal="regular" onPress={ () => item.AttributeImages.length >=4 ? null: imagePressHandler( item as IAttributes )}>
                                <InputWithIcon 
                                    rightIcon=
                                        {{ name: 'camera', type: 'font-awesome' }}
                                    labelStyle={{ color: theme.colors.primary , fontSize: theme.textVariants?.heading5?.fontSize }}
                                    editable={false}
                                    label="Upload Image"
                                    placeholder="Upload Image"
                                    // onChangeText={handleChange( "username" )}
                                /> 
                            </TouchableBox>
                            <Box flex={1}>
                                <RenderAttributeImages 
                                    attributeData={item}
                                />
                            </Box>

                        </Box>
                    )
                }
            </Observer>
        )             
    }

    return (
        <Box flex={1}>
            <FlatList 
                data={AuditStore.groupsAndAttributesData( groupId ) as IAttributes[]}
                renderItem={renderItem}
                extraData={refreshing}
                keyExtractor={( item ) => item.AttributeOrder }
                contentContainerStyle={STYLES.contentContainerStyle}
                ItemSeparatorComponent={ItemSeparatorComponent}
            />
        </Box>
    )
} )