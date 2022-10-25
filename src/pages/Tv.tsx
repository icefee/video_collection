import React, { useState, useEffect, useMemo } from 'react';
import { View, BackHandler } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import VideoPlayer from '../components/VideoPlayer';
import { useTheme } from '../hook/theme';
import Orientation from 'react-native-orientation';
import { useWindowSize } from '../hook/screen';

function Tv() {
    const route = useRoute()
    const navigation = useNavigation()
    const { statusBarColor } = useTheme()
    const [isFullscreen, setIsFullscreen] = useState(false)

    const [width, height] = useWindowSize()

    const videoInfo = useMemo<TVChannel>(
        () => route.params as TVChannel,
        [route]
    )

    const [videoWidth, videoHeight] = useMemo(() => {
        if (isFullscreen) {
            return [
                height,
                width
            ]
        }
        else return [
            width,
            height * .4
        ]
    }, [width, height, isFullscreen])
    // const [playingUrl, setPlayingUrl] = useState('')

    useEffect(() => {
        navigation.setOptions({
            title: videoInfo.title,
        })
    }, [])

    useEffect(() => {
        if (isFullscreen) {
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                () => {
                    if (isFullscreen) {
                        dismissFullscreen()
                        return true;
                    }
                    return false;
                }
            );
            return () => backHandler.remove();
        }
    }, [isFullscreen])

    const enterFullscreen = () => {
        Orientation.lockToLandscapeLeft();
        // StatusBar.setBackgroundColor('transparent');
        // StatusBar.setTranslucent(true)
        navigation.setOptions({
            headerShown: false,
            statusBarColor: 'transparent'
        })
        setIsFullscreen(true)
    }

    const dismissFullscreen = () => {
        Orientation.lockToPortrait()
        // StatusBar.setBackgroundColor(statusBarColor);
        // StatusBar.setTranslucent(false)
        navigation.setOptions({
            headerShown: true,
            statusBarColor
        })
        setIsFullscreen(false)
    }

    return (
        <View style={{ flex: 1 }}>
            <VideoPlayer
                width={videoWidth}
                height={videoHeight}
                url={videoInfo.url}
                live
                fullscreen={isFullscreen}
                onRequestFullscreen={() => {
                    if (isFullscreen) {
                        dismissFullscreen()
                    }
                    else {
                        enterFullscreen()
                    }
                }}
            />
        </View>
    )
}

export default Tv;
