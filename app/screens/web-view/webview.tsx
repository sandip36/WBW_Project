import { useNavigation } from "@react-navigation/core"
import React, { useEffect, useRef } from "react"
import { ActivityIndicator, BackHandler, StyleProp, ViewStyle } from "react-native"
import { makeStyles } from "theme"
import { WebView } from 'react-native-webview';
import { useRoute } from "@react-navigation/native";
import { FormHeader } from "components/core/header/form-header";
import { Box } from "components";
export type WebViewScreenProps = {
    url: string
    tital:string
}

export type WebViewStyleProps = {
  containerStyle: StyleProp<ViewStyle>
}

const useStyles = makeStyles<WebViewStyleProps>( ( theme ) => ( {
    containerStyle: { width: '100%', height: '100%' },
} ) )

export const WebViewScreen: React.FunctionComponent<WebViewScreenProps> = ( props ) => {
    const route = useRoute()
    const {
        url,
        tital
    } = route.params as any    
    const navigation = useNavigation()
    const STYLES = useStyles()
    const webviewRef = useRef( null )
    let canGoBack = true

    useEffect( () => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            _handleBackPress
        );
        return () => backHandler.remove();
    }, [] )

    useEffect( ( ) => {
        _handleBackPress()
    }, [ canGoBack ] )

    const _handleBackPress = ( ) => {
        // Works on both iOS and Android
        if( canGoBack ) {
            webviewRef.current.goBack()
        }else{
            navigation.goBack()
        }
        return true
    }

    return (
        <Box flex={1}>
            <FormHeader 
                title={tital}
                navigation={navigation}
                customBackHandler={_handleBackPress}
            />
            <WebView 
                ref={webviewRef}
                style={STYLES.containerStyle} 
                source={{ uri: url }} 
                onNavigationStateChange={( event ) => {
                    canGoBack = event.canGoBack
                }}
                startInLoadingState={true}
                renderLoading={()=> (
                    <Box 
                        style={STYLES.containerStyle} 
                        justifyContent="center" 
                        alignItems="center"
                    >
                        <ActivityIndicator size="large" color="red" />
                    </Box>
                )}
            />
        </Box>
    )
}
