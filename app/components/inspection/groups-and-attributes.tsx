import { Box, InputWithIcon, Text, TextAreaInput, TouchableBox } from "components"
import React from "react"
import { useNavigation } from "@react-navigation/native"
import { IAttributes, IImages, useStores } from "models"
import { FlatList, ImageStyle, StyleProp, ViewStyle } from "react-native"
import { makeStyles, theme } from "theme"
import { Dropdown } from "components/core/dropdown"
import { Asset, ImageLibraryOptions, launchImageLibrary } from "react-native-image-picker"
import Toast from "react-native-simple-toast"
import { Observer, observer } from "mobx-react-lite"
import { Image } from "react-native-elements"
import { isEmpty } from "lodash"

export type GroupsAndAttributesProps = {
    groupId: string
}

const ItemSeparatorComponent = ( ) => {
    return (
        <Box height={24} />
    )
}

const useStyles = makeStyles<{contentContainerStyle: StyleProp<ViewStyle>, imageStyle: StyleProp<ImageStyle>}>( ( theme ) => ( {
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
    }
} ) )

export type RenderImageProps = {
    image: IImages,
    style?: StyleProp<ImageStyle>
}

export const RenderImage: React.FunctionComponent<RenderImageProps> = ( props ) => {
    const { image, style } = props
    return (
        <Box flex={1} bg="transparent" flexDirection="row">
            <Box>
                <Image
                    source={{ uri: image.uri }}
                    style={style}
                />
            </Box>
        </Box>
    )
}

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
    const { AuditStore, TaskStore } = useStores()

    
    const imagePressHandler = async ( item: IAttributes ) => {
        const result = await launchImageLibrary( IMAGE_OPTIONS )
        if( result.didCancel ) {
            return null
        }else if( result.errorCode ) {
            Toast.showWithGravity( result.errorMessage || 'Something went wrong while picking image', Toast.LONG, Toast.CENTER )
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
            await item.setImages( IMAGE_OBJECT )
        }
    }

    const renderImageItem = ( { item } ) => {
        return (
            <Box flex={1} flexDirection="row" marginHorizontal="medium">
                <RenderImage 
                    image={item}
                    style={STYLES.imageStyle as StyleProp<ImageStyle>}
                />
            </Box>
        )
    }

    const navigateToAssignOrCompleteTask = async ( item: IAttributes ) => {
        await TaskStore.setAttributeID( item.AttributeID )
        await TaskStore.setCustomFormResultID( item.CustomFormResultID )
        await TaskStore.setCurrentHazardId( item.HazardsID )
        await TaskStore.setCurrentTitle( item.Title )
        navigation.navigate( 'CompleteOrAssignTask' )
    }

    const renderItem = ( { item }: {item:IAttributes } ) => {
        return (
            <Box flex={1}>
                <Box marginHorizontal="regular">
                    <Text variant="heading4" marginHorizontal="medium" fontWeight="bold">{item.AttributeOrder}. {item.Title}</Text>
                </Box>
                {
                    item.AuditAndInspectionScoreID === "6"
                        ? null
                        : <Box>
                            <Dropdown
                                title={AuditStore?.inspection?.AuditAndInspectionDetails?.ScoringLable}
                                items={AuditStore.getDropdownData( item.ScoreList )}
                                value={AuditStore.isPassingValuesSelected && item.GivenAnswerID === "0" ? item.MaxCorrectAnswerID : item.GivenAnswerID }
                                onValueChange={item.setGivenAnswerId}
                            />
                        </Box>
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
                    AuditStore.shouldShowHazard( item.DoNotShowHazard ) && AuditStore.inspection.GroupsAndAttributes.HazardList.length > 0 && item.AuditAndInspectionScoreID !== "6"
                        ? <Dropdown
                            title="Hazard List"
                            items={AuditStore.hazardList}
                            value={item.HazardsID}
                            onValueChange={( value )=>{
                                item.setHazardId( value )
                                if( !isEmpty( value ) ){
                                    navigateToAssignOrCompleteTask( item )
                                }
                            }}
                        />
                        : null
                }
                <Observer>
                    {
                        () => (
                            <Box marginHorizontal="regular" mt="regular">
                                <TextAreaInput 
                                    label={item.commentsMandatoryOrNot}
                                    labelStyle={{ color: theme.colors.primary, fontSize: theme.textVariants.heading5?.fontSize  }}
                                    placeholder="Comments"
                                    defaultValue={item.Comments}                        
                                    onChangeText={ ( text ) => item.setComments( text ) }
                                /> 
                            </Box>
                        ) 
                    }
                </Observer>
                <TouchableBox marginHorizontal="regular" onPress={ () => imagePressHandler( item as IAttributes )}>
                    <InputWithIcon 
                        rightIcon={{ name: 'camera', type: 'font-awesome' }}
                        labelStyle={{ color: theme.colors.primary , fontSize: theme.textVariants?.heading5?.fontSize }}
                        editable={false}
                        label="Upload Image"
                        placeholder="Upload Image"
                    // onChangeText={handleChange( "username" )}
                    /> 
                </TouchableBox>
                <Box flex={1} flexDirection="row" marginHorizontal="regular">
                    <FlatList 
                        data={item.auditImage}
                        extraData={item.auditImage}
                        keyExtractor={( item,index ) => String( index ) }
                        renderItem={renderImageItem}
                        horizontal={true}
                    />
                </Box>
            </Box>
            
        )
    }

    return (
        <Box flex={1}>
            <FlatList 
                data={AuditStore.groupsAndAttributesData( groupId ) as IAttributes[]}
                renderItem={renderItem}
                keyExtractor={( item ) => item.AttributeID }
                contentContainerStyle={STYLES.contentContainerStyle}
                ItemSeparatorComponent={ItemSeparatorComponent}
            />
        </Box>
    )
} )