import React, { FC, useState } from "react"
import FastImage, { Source } from 'react-native-fast-image'
import { ViewStyle, ImageStyle, ImageURISource, ImageProps, ActivityIndicator } from "react-native"
import { Box, TouchableBox, TouchableBoxProps } from "../box"
import { useTheme } from "theme"
import { Text } from "../text"

export type AvatarProps = {
    size?: number;
    source?: number | ImageURISource;
    text?: string;
    defaultSource?: number | ImageURISource;
    onLoad?: () => void
    onError?: () => void
    onLoadStart?: () => void
} & TouchableBoxProps & Omit<ImageProps, 'source' | 'loadingIndicatorSource'>

const sourceToFastImageSource = ( source: ImageURISource | Source | number ): Source | number => {
    if ( !source ) {
        return {
            uri: 'http://trigger-failure',
            cache: 'web',
            headers: {
                Pragma: 'no-cache'
            }
        }
    }
    if ( typeof source === 'number' ) {
        return source
    } else {
        return {
            uri: source.uri ? source.uri : 'http://trigger-failure',
            cache: 'web',
            headers: {
                Pragma: 'no-cache'
            }
        }
    }
}

export const Avatar: FC<AvatarProps> = ( props ) => {
    const theme = useTheme()
    const {
        size = 32,
        source: _source,
        defaultSource = theme.assets.logo,
        onPress,
        onLoad,
        onLoadStart,
        onError,
        text,
        style,
        ...rest
    } = props
    const imageStyle = style ? { ...style } : { position: 'absolute', top: 0, left: 0, width: size, height: size } as ImageStyle

    const wrapperStyle = { width: size, height: size, borderRadius: size / 2, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', ...style } as ViewStyle
    const [ loading, setLoading ] = useState<boolean>( )
    const [ , setError ] = useState<string>( )
    const { colors: { primary }, BASE_FONT_SIZE } = useTheme()

    const [ source, setSource ] = useState<Source | number>( sourceToFastImageSource( _source ) )

    const _onLoadStart = ( ) => {
        setLoading( true )
        setError( undefined )
        if ( onLoadStart ) {
            onLoadStart( )
        }
    }

    const _onLoad = () => {
        setLoading( false )
        if ( onLoad ) {
            onLoad( )
        }
    }

    const _onError = ( ) => {
        onError?.()
        const src = sourceToFastImageSource( defaultSource )
        setSource( src )
        setLoading( false )
    }

    const renderLoading = ( ) => {
        return loading ? (
            <Box position="absolute" top={0} left={0} bottom={0} right={0} alignItems="center" justifyContent="center">
                <ActivityIndicator color={primary} size={BASE_FONT_SIZE} />
            </Box>
        ) : null
    }

    const WrapperComponent = onPress ? TouchableBox : Box

    return (
        <WrapperComponent style={wrapperStyle} {...rest} {...{ onPress }}>
            {text
                ? <Text variant="caption" color="grey">
                    {text}
                </Text>
                : <FastImage
                    onError={_onError}
                    onLoadStart={_onLoadStart}
                    onLoad={_onLoad}
                    style={imageStyle}
                    source={source}
                    resizeMode={FastImage.resizeMode.cover}
                />
            }
            {!text && renderLoading() }
        </WrapperComponent>
    )
}

Avatar.defaultProps = {
    size: 32
}
