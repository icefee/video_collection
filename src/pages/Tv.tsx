import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, BackHandler } from 'react-native';
import Orientation from 'react-native-orientation';
import { useRoute, useNavigation } from '@react-navigation/native';
import VideoPlayer from '../components/VideoPlayer';
import EpisodeSelection from '../components/EpisodeSelection';
import { useTheme } from '../hook/theme';
import { useWindowSize } from '../hook/screen';
import { assetUrl } from '../config';
import { Base64Params } from '../util/clue';

function Tv() {
    const route = useRoute()
    const navigation = useNavigation()
    const { statusBarColor, textColor, paperColor } = useTheme()
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [source, setSource] = useState(0)

    const [width, height] = useWindowSize()

    const tvChannel = useMemo<TVChannel>(
        () => route.params as TVChannel,
        [route]
    )

    const activeSource = useMemo<TvSource>(
        () => {
            if (Array.isArray(tvChannel.source)) {
                return tvChannel.source[source]
            }
            return tvChannel.source
        },
        [tvChannel, source]
    )

    const [playerWidth, playerHeight] = useMemo(() => {
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
            title: tvChannel.title,
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

    const parseSource = (url: string) => `${assetUrl}/api/video/tv/parse/${Base64Params.create(url)}`

    return (
        <View style={{ flex: 1 }}>
            <VideoPlayer
                width={playerWidth}
                height={playerHeight}
                url={activeSource.parse ? parseSource(activeSource.url) : activeSource.url}
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
            <View style={{ flex: 1, backgroundColor: paperColor }}>
                <View style={{
                    padding: 10
                }}>
                    <Text style={{ color: textColor }}>信号源</Text>
                </View>
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    }}>
                        {
                            Array.isArray(tvChannel.source) ? tvChannel.source.map(
                                (_m3u8, index) => (
                                    <EpisodeSelection
                                        key={index}
                                        active={source === index}
                                        onPress={
                                            () => setSource(index)
                                        }
                                    >源{index + 1}</EpisodeSelection>
                                )
                            ) : (
                                <EpisodeSelection active>源1</EpisodeSelection>
                            )
                        }
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default Tv;
