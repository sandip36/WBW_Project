import { useNavigation } from "@react-navigation/core"
import React, { useEffect, useRef } from "react"
import { BackHandler, StyleProp, ViewStyle } from "react-native"
import { makeStyles } from "theme"
import { WebView } from 'react-native-webview';
import { SafeAreaView } from "react-native-safe-area-context"
export interface WebViewProps {
    url: string
}

export type WebViewStyleProps = {
  containerStyle: StyleProp<ViewStyle>
}

const useStyles = makeStyles<WebViewStyleProps>( ( theme ) => ( {
    containerStyle: { width: '100%', height: '100%' },
} ) )

export const WebViewScreen: React.FunctionComponent<WebViewProps> = ( props ) => {
    const { url } = props
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
        <SafeAreaView style={STYLES.containerStyle}>
            <WebView ref={webviewRef} source={{ uri: url }} onNavigationStateChange={( event ) => {
                canGoBack = event.canGoBack
            }}/>
        </SafeAreaView>
    )
}
