import { useNavigation } from "@react-navigation/native"
import { Box, Text } from "components"
import { FormHeader } from "components/core/header/form-header"
import React, { useCallback, useState } from "react"
import { Dimensions, FlatList, Image, ActivityIndicator } from "react-native"
import { Avatar, ListItem } from "react-native-elements"
import Video from "react-native-video"
import Async from "react-async"
import { useStores } from "models"

export type MediaListScreenProps = {

}


const postsList = {
    "posts": [
        {
            "id": 1,
            "username": "Sandip",
            "title": "Uddhav Thackeray Resigns",
            "subtitle": "Maharashtra Government",
            "logo": "https://cdn1.iconfinder.com/data/icons/avatars-55/100/avatar_profile_user_music_headphones_shirt_cool-512.png",
            "description": "lorem ipsum is the best",
            "media": [
                {
                    "mediaId": 101,
                    "postId": 1,
                    "type": "image",
                    "uri": "https://th.bing.com/th/id/OIP.1U3zHtP_FzMHeyF5zTtHDQHaDt?pid=ImgDet&rs=1"
                },
                {
                    "mediaId": 102,
                    "postId": 1,
                    "type": "video",
                    "uri": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                }
            ]
        },
        {
            "id": 2,
            "username": "Sandesh",
            "title": "Indian Cricket in right hands",
            "subtitle": "Rahul-Rohit leads team",
            "logo": "https://cdn1.iconfinder.com/data/icons/avatars-55/100/avatar_profile_user_music_headphones_shirt_cool-512.png",
            "description": "lorem ipsum is the best",
            "media": [
                {
                    "mediaId": 103,
                    "postId": 2,
                    "type": "image",
                    "uri": "https://th.bing.com/th/id/OIP.1U3zHtP_FzMHeyF5zTtHDQHaDt?pid=ImgDet&rs=1"
                },
                {
                    "mediaId": 104,
                    "postId": 2,
                    "type": "video",
                    "uri": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                }
            ]

        }
    ]
}


export const MediaListScreen: React.FunctionComponent<MediaListScreenProps> = ( ) => {
    const navigation = useNavigation()
    const { MediaStore } = useStores()
    const renderImage = ( item ) => {
        console.log( 'image',item )
        return (
            <Box width={500} height={500}>
                <Text>{item.type}</Text>
                <Image 
                    source={{
                        uri: 'https://reactnative.dev/img/tiny_logo.png',
                    }}
                    width={500}
                    height={500}
                />
            </Box>
        )
    }

    const fetchMedia = useCallback( async () => {
        await MediaStore.fetch()
    }, [] )
    
    const renderVideo = ( item ) => {
        return (
            <Box width={Dimensions.get( 'screen' ).width * 0.95} height={Dimensions.get( 'screen' ).height * 0.5}>
                <Video 
                    source={{ uri: item.url }}   // Can be a URL or a local file.
                    style={{ width: "100%",height: "100%" }} 
                />
            </Box>
        )
    }
    
    const renderPostMedia = ( { item, index } ) => {
        if( item.type === "image" ) {
            return (
                <Box width={Dimensions.get( 'screen' ).width} height={Dimensions.get( 'screen' ).height * 0.5}>
                    <Image 
                        source={{ uri: item.uri }}
                        style={{ width: Dimensions.get( 'screen' ).width, height: Dimensions.get( 'screen' ).height * 0.5 }}
                    />
                </Box>
            )
        }else{
            return(
                <Box flex={1}>
                    <Video 
                        source={{ uri: item.uri }}   // Can be a URL or a local file.
                        style={{ width: Dimensions.get( 'screen' ).width, height: Dimensions.get( 'screen' ).height * 0.5 }}
                        resizeMode="cover"
                    />
                </Box>
            )
        }
       
    }

    const ItemSeparatorComponent = ( ) => {
        return (
            <Box height={20} />
        )
    }

    const renderItem = ( { item, index } ) => {
        return (
            <Box flex={1}>
                <ListItem>
                    <Avatar rounded size="small" source={{ uri: item.logo }} />
                    <ListItem.Content>
                        <ListItem.Title>{item.title}</ListItem.Title>
                        <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
                <FlatList 
                    data={item.media}
                    renderItem={renderPostMedia}
                    horizontal
                    keyExtractor={( item ) => String( item.mediaId )}
                    ItemSeparatorComponent={ItemSeparatorComponent}
                />
            </Box>
        )
    }
    return (
        // <Box flex={1}>
        //     <FormHeader 
        //         title="Media"
        //         navigation={navigation}
        //     />    
        //     <FlatList 
        //         data={postsList.posts}
        //         renderItem={renderItem}
        //         keyExtractor={( item )=> String( item.id )}                
        //     />
        // </Box>
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
                    <Box>
                        <Text>Inside Media Screen</Text>
                    </Box>
                </Box>
            </Async.Resolved>
        </Async>
    )
}