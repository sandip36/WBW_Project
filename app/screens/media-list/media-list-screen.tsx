import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { Box, Text, TouchableBox, Button } from "components"
import { FormHeader } from "components/core/header/form-header"
import React, { useCallback } from "react"
import { FlatList, Image, ActivityIndicator, Linking, ViewStyle, StyleProp, ImageStyle, TextStyle } from "react-native"
import { Avatar, ListItem } from "react-native-elements"
import Video from "react-native-video"
import Async from "react-async"
import { IMedia, useStores } from "models"
import InAppBrowser from "react-native-inappbrowser-reborn"
import { theme, makeStyles } from "theme"
import { isEmpty } from "lodash"
import  { Observer } from "mobx-react-lite"

export type MediaListScreenProps = {

}

const useStyles = makeStyles<{contentContainerStyle: StyleProp<ViewStyle>, listTitleStyle: StyleProp<TextStyle>, videoStyle: StyleProp<ViewStyle>, imageStyle: StyleProp<ImageStyle>, buttonContainerStyle: StyleProp<ViewStyle>}>( ( theme ) => ( {
    contentContainerStyle: { 
        padding:0, 
        margin:0 , 
        backgroundColor:"transparent" 
    },
    listTitleStyle: { 
        fontSize:18 ,
        color:theme.colors.primary , 
        fontWeight:"700" 
    },
    videoStyle: { 
        width:"100%" ,
        height:"100%" 
    },
    imageStyle: { 
        width:"100%" ,
        height:"100%" 
    },
    buttonContainerStyle: { 
        marginHorizontal: 0, 
        marginVertical: 0 
    },

} ) )

export const MediaListScreen: React.FunctionComponent<MediaListScreenProps> = ( ) => {
    const navigation = useNavigation()
    const { MediaStore } = useStores()
    const STYLES = useStyles()

    useFocusEffect(
        React.useCallback( () => {
            fetchMedia()
        }, [] )
    );
    
    const fetchMedia = useCallback( async () => {
        await MediaStore._clear()
        await MediaStore.fetch()
    }, [] )

    const fetchNextMedia = useCallback( async () => {
        await MediaStore.fetchNextMedia( )
    }, [] )
  
    const openInAppBrowser = async ( link ) => {
        try {
            // const token = await AsyncStorage.getItem( 'Token' )
            if( link ) {
                if ( await InAppBrowser.isAvailable() ) {
                    await InAppBrowser.open( link )
                }
                else Linking.openURL( link )
            }
        } catch ( error ) {
            await InAppBrowser.close()
            if ( await InAppBrowser.isAvailable() ) {
                await InAppBrowser.open( link )
            }
            else Linking.openURL( link )
        }
    }



    const renderItem = ( { item }: {item:IMedia } ) => {
        return (
            <Observer>
                {
                    
                    ( ) => (
                       
                        <Box margin="small" flex={1} mx="regular" my="medium" borderRadius="large" borderWidth={1} borderColor={
                            !isEmpty( item?.Message1 ) 
                                ?  item?.Message1IsRead === "False"
                                    ?  item.IsDisplayCompleted === "False" ?
                                        "lightGreyBorder" :
                                        "error"
                                    : "success"
                                : "lightGreyBorder" 
                        }>
                            <Box p="regular" >
                                <ListItem containerStyle={STYLES.contentContainerStyle}>
                                    <Avatar 
                                        rounded 
                                        size="medium"  
                                        title={item.initials}
                                        overlayContainerStyle={{ backgroundColor: theme.colors.primary }} 
                                    />
                                    <ListItem.Content>
                                        <ListItem.Title style={STYLES.listTitleStyle} >{item.FirstName} {item.LastName}</ListItem.Title>
                                        <ListItem.Subtitle>{item.CreatedOn}</ListItem.Subtitle>
                                    </ListItem.Content>
                                </ListItem>
                                <Box >
                                    <Text variant="heading5" mt="regular" mb="medium">{item.Title}</Text>
                                </Box>
                                {
                                    !isEmpty( item.ImagePath )|| !isEmpty( item.VideoPath ) ?
                                        <Box  height={200} alignItems="center">
                                            {
                                                isEmpty( item.ImagePath ) && !isEmpty( item.VideoPath ) ?
                                                    <Video 
                                                        source={{ uri: item.VideoPath }}
                                                        style={STYLES.videoStyle}
                                                        controls ={true}
                                                        paused ={
                                                            true
                                                        }
                                                        playInBackground ={false}
                                                        resizeMode="cover"
                                                    // Can be a URL or a local file.
                                                    /> 
                                                    : !isEmpty( item.ImagePath ) && isEmpty( item.VideoPath ) ?
                                                        <Image 
                                                            source={{ uri: item.ImagePath }}
                                                            style={STYLES.imageStyle}
                                                            resizeMode="contain"
                                                        /> 
                                                        :null
                                            } 
                                
                                        </Box>  
                                        : null
                                }
                               
                                <Box my="regular">
                                    <Text variant="body" textAlign="justify" lineHeight={20} color="lightGrey5">{item.Description}</Text>
                                </Box>

                                {     !isEmpty( item?.Link2 )||  !isEmpty( item?.Link1 ) ?
                                    <Box alignItems="flex-end" mx="regular" my="medium">
                                        {
                                            !isEmpty( item?.Link1 )?
                                                <TouchableBox my="medium" onPress={ ( ) => openInAppBrowser( item?.Link1 ) }>
                                                    <Text color="primary" fontSize={16} fontWeight="700">{item?.Link1Name}</Text>
                                                </TouchableBox>  
                                                :null
                                        }    
                                        {
                                            !isEmpty( item?.Link2 )?
                                                <TouchableBox my="medium" onPress={ ( ) => openInAppBrowser( item?.Link2 ) }>
                                                    <Text color="primary" fontSize={16} fontWeight="700">{item?.Link2Name}</Text>
                                                </TouchableBox>  
                                                :null
                                        }    
                                      
                                    </Box>
                                    :null
                                }

                                {
                                    item.IsDisplayCompleted === "True" ?
                                        <Box flex={1} mb="regular" alignItems="center" flexDirection="row">
                                            <Box flex={0.6}>
                                                <Text variant="heading5" textAlign="auto" lineHeight={20}  fontWeight="700" color="primary">{item?.Message1}</Text>
                                            </Box>
                                            <Box flex={0.05}/> 
                                            <Box flex={0.3}>
                                                {
                                                    item.Message1IsRead === "True"
                                                        ? 
                                                        <Button 
                                                            containerStyle={STYLES.buttonContainerStyle}
                                                            buttonStyle={{ padding: theme.spacing.regular }}
                                                            title="Completed"
                                                            disabled
                                                        />
                                                        : <Button 
                                                            containerStyle={STYLES.buttonContainerStyle}
                                                            buttonStyle={{ padding: theme.spacing.regular }}
                                                            title="Completed"
                                                            // onPress={( ) => item.setMessage1IsRead( )}
                                                            onPress={ async ( ) => {
                                                                await MediaStore.readMessageFlag( item.id )
                                                                await   item.setMessage1IsRead( "True" )                                                   }
                                                            }
                                                        />
                                                }
                                            </Box>
                                        </Box>
                                        :
                                        <Box flex={1}>
                                            {
                                                !isEmpty( item.Message1 ) ?
                                                    <Box margin="regular">
                                                        <Text variant="heading5" textAlign="auto" lineHeight={20}  fontWeight="700" color="primary">{item?.Message1}</Text>
                                                    </Box>:null
                                            }
                                        </Box>
                                        
                                }
                            </Box>
                        </Box>
                    )
                }
            </Observer>
        )
    }
    return (
        <Async promiseFn={fetchMedia}>
            <Async.Pending>
                { ( ) => (
                    <Box position="absolute" top={0} left={0} right={0} bottom={0} alignItems="center" justifyContent="center">
                        <ActivityIndicator size={32} color="red" />
                    </Box>
                ) }
            </Async.Pending>
            <Async.Rejected>
                { 
                    ( error: any ) => {
                        return (
                            <Box justifyContent="center" alignItems="center" flex={1}>
                                <Text>{error.reason || error.message || 'Something went wrong'}</Text>
                            </Box>
                        ) }
                }
            </Async.Rejected>
            <Async.Resolved>
                <Box flex={1}>
                    <FormHeader 
                        title="Media"
                        navigation={navigation}
                    />
                    <Box flex={1}>
                        <FlatList 
                            data={MediaStore.items }
                            renderItem={renderItem}
                            onEndReached={fetchNextMedia}
                            onEndReachedThreshold={0.01}
                            keyExtractor={( item )=> String( item.id )}                
                        />
                    </Box>
                </Box>
            </Async.Resolved>
        </Async>
    )
}