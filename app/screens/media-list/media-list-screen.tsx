import { useNavigation } from "@react-navigation/native"
import { Box, Text, TouchableBox } from "components"
import { FormHeader } from "components/core/header/form-header"
import React, { useCallback, useState } from "react"
import { Dimensions, FlatList, Image, ActivityIndicator, Linking } from "react-native"
import { Avatar, ListItem } from "react-native-elements"
import Video from "react-native-video"
import Async from "react-async"
import { useStores } from "models"
import InAppBrowser from "react-native-inappbrowser-reborn"
import { theme } from "theme"
import { isEmpty } from "lodash"

export type MediaListScreenProps = {

}


const mediaList = [
    {
        BulletinID:"82dace18-cf67-4fc3-87d4-8e1fe04d60fd",
        Title:"TestBulletine new",
        Description:"Loremipsumdolorsitamet,consecteturadipiscingelit,seddoeiusmodtemporincididuntutlaboreetdoloremagnaaliqua.Utenimadminimveniam,quisnostrudexercitationullamcolaborisnisiutaliquipexeacommodoconsequat.Duisauteiruredolorinreprehenderitinvoluptatevelitessecillumdoloreeufugiatnullapariatur.Excepteursintoccaecatcupidatatnonproident,suntinculpaquiofficiadeseruntmollitanimidestlaborum",
        VideoPath:"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        logo:"https://cdn1.iconfinder.com/data/icons/avatars-55/100/avatar_profile_user_music_headphones_shirt_cool-512.png",
        ImagePath:"",
        PlayVideoOnDelivery:"True",
        Link1Name:"Register",
        Link1:"https://demo.wisebusinessware.com/",
        Link2Name:"Testing link 2",
        Link2:"https://www.google.com",
        CreatedOn:"7/6/202212:00:00AM",
        CreatedByName:"admin,wardmfg",
        FirstName:"wardmfg",
        LastName:"admin"
    },{
        BulletinID:"82dace18-cf67-4fc3-87d4-8e1fe04d60fd",
        Title:"TestBulletine",
        Description:"Loremipsumdolorsitamet,consecteturadipiscingelit,seddoeiusmodtemporincididuntutlaboreetdoloremagnaaliqua.Utenimadminimveniam,quisnostrudexercitationullamcolaborisnisiutaliquipexeacommodoconsequat.Duisauteiruredolorinreprehenderitinvoluptatevelitessecillumdoloreeufugiatnullapariatur.Excepteursintoccaecatcupidatatnonproident,suntinculpaquiofficiadeseruntmollitanimidestlaborum",
        VideoPath:"",
        ImagePath:"https://cdn1.iconfinder.com/data/icons/avatars-55/100/avatar_profile_user_music_headphones_shirt_cool-512.png",
        logo:"https://cdn1.iconfinder.com/data/icons/avatars-55/100/avatar_profile_user_music_headphones_shirt_cool-512.png",
        PlayVideoOnDelivery:"True",
        Link1Name:"hello sandesh",
        Link1:"https://demo.wisebusinessware.com/",
        Link2Name:"",
        Link2:"",
        CreatedOn:"7/6/202212:00:00AM",
        CreatedByName:"admin,wardmfg",
        FirstName:"Sandip",
        LastName:"Jadhav"
    },{
        BulletinID:"82dace18-cf67-4fc3-87d4-8e1fe04d60fd",
        Title:"TestBulletine",
        Description:"Loremipsumdolorsitamet,consecteturadipiscingelit,seddoeiusmodtemporincididuntutlaboreetdoloremagnaaliqua.Utenimadminimveniam,quisnostrudexercitationullamcolaborisnisiutaliquipexeacommodoconsequat.Duisauteiruredolorinreprehenderitinvoluptatevelitessecillumdoloreeufugiatnullapariatur.Excepteursintoccaecatcupidatatnonproident,suntinculpaquiofficiadeseruntmollitanimidestlaborum",
        VideoPath:"",
        ImagePath:"",
        logo:"https://cdn1.iconfinder.com/data/icons/avatars-55/100/avatar_profile_user_music_headphones_shirt_cool-512.png",
        PlayVideoOnDelivery:"True",
        Link1Name:"hello sandesh",
        Link1:"https://demo.wisebusinessware.com/",
        Link2Name:"",
        Link2:"",
        CreatedOn:"7/6/202212:00:00AM",
        CreatedByName:"admin,wardmfg",
        FirstName:"Sandesh",
        LastName:"kasliwal"
    }
]


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

    const openInAppBrowser = async ( link ) => {
        try {
            // const token = await AsyncStorage.getItem( 'Token' )
            if( link ) {
                if ( await InAppBrowser.isAvailable() ) {
                    const result = await InAppBrowser.open( link )
                }
                else Linking.openURL( link )
            }
        } catch ( error ) {
            await InAppBrowser.close()
            if ( await InAppBrowser.isAvailable() ) {
                const result = await InAppBrowser.open( link )
            }
            else Linking.openURL( link )
        }
    }

    const renderItem = ( { item, index } ) => {
        return (
            <Box margin="small" flex={1} mx="regular" my="medium" borderRadius="large" elevation={2} >
                <Box p="regular" >
               
                    <ListItem containerStyle={{ padding:0, margin:0 , backgroundColor:"transparent" }}>
                        <Avatar rounded size="medium" source={{ uri: item.logo }} />
                        <ListItem.Content>
                            <ListItem.Title style={{ fontSize:18 ,color:theme.colors.primary , fontWeight:"700" }} >{item.FirstName} {item.LastName}</ListItem.Title>
                            <ListItem.Subtitle>{item.CreatedOn}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                    <Box >
                        <Text variant="heading5" mt="regular" mb="medium">{item.Title}</Text>
                    </Box>
                    <Box  height={200} alignItems="center">
                        {
                            isEmpty( item.ImagePath ) && !isEmpty( item.VideoPath ) ?
                                <Video 
                                    source={{ uri: item.VideoPath }}
                                    style={{ width:"100%" ,height:"100%" }}
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
                                        style={{ width:"100%" ,height:"100%" }}
                                        resizeMode="contain"
                                    /> 
                                    :null
                        } 
                       
                    </Box>
                    
                    <Box my="regular">
                        <Text variant="body" textAlign="justify" lineHeight={20} color="lightGrey5">{item.Description}</Text>
                    </Box>
                    <Box alignItems="flex-end" mx="regular" my="regular">
                        <TouchableBox onPress={ ( ) => openInAppBrowser( item.Link1 ) }>
                            <Text color="primary" fontSize={16} fontWeight="700">{item.Link1Name}</Text>
                        </TouchableBox>     
                        <TouchableBox my="medium" onPress={ ( ) => openInAppBrowser( item?.Link2 ) }>
                            <Text color="primary" fontSize={16} fontWeight="700">{item?.Link2Name}</Text>
                        </TouchableBox>     
                    </Box>
                </Box>
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
                    <Box flex={1}>
                        <FlatList 
                            data={mediaList}
                            renderItem={renderItem}
                            keyExtractor={( item )=> String( item.BulletinID )}                
                        />
                    </Box>
                </Box>
            </Async.Resolved>
        </Async>
    )
}