import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, Text, BackHandler } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import VideoPlayer from '../components/VideoPlayer';
import { useTheme } from '../hook/theme';
import Orientation from 'react-native-orientation';
import { useWindowSize } from '../hook/screen';
import EpisodeSelection from '../components/EpisodeSelection';
import VideoUrlParser from '../components/VideoUrlParser';

export const getM3u8Uri: (url_template: string, m3u8: M3u8Video) => string = (url_template, m3u8) => {
    if (typeof m3u8 === 'string') {
        return m3u8
    }
    else {
        return m3u8.reduce(
            (prev, current, i) => {
                return String(prev).replace(new RegExp('\\{' + i + '\\}', 'g'), String(current))
            },
            url_template
        ) as string
    }
}

function Video() {
    const route = useRoute()
    const navigation = useNavigation()
    const { paperColor, textColor, statusBarColor } = useTheme()
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [activeEpisode, setActiveEpisode] = useState(0)

    const [width, height] = useWindowSize()

    const videoInfo = useMemo<Video>(
        () => route.params as Video,
        [route]
    )
    const isEpisode = useMemo<boolean>(
        () => 'episodes' in videoInfo,
        [videoInfo]
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

    const playingUrl = useMemo<string>(() => {
        if (isEpisode) {
            const video = videoInfo as Episode;
            return getM3u8Uri(video.url_template!, video.m3u8_list[activeEpisode])
        }
        else {
            return (videoInfo as Film).m3u8_url
        }
    }, [activeEpisode])

    useEffect(() => {
        navigation.setOptions({
            title: videoInfo.title,
        })
    }, [])

    const playNext = () => {
        if (isEpisode) {
            if (activeEpisode < (videoInfo as Episode).episodes - 1) {
                setActiveEpisode(
                    prevEpisode => prevEpisode + 1
                )
            }
        }
    }

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

    /*
    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            if (!isFullscreen) {
                return;
            }
            else {
                e.preventDefault()
                setIsFullscreen(false)
            }
        })
    }, [isFullscreen, navigation])
    */

    return (
        <View style={{ flex: 1 }}>
            <VideoUrlParser style={{
                width: videoWidth,
                height: videoHeight
            }} url={playingUrl}>
                {
                    (url) => (
                        <VideoPlayer
                            width={videoWidth}
                            height={videoHeight}
                            url={url}
                            fullscreen={isFullscreen}
                            onRequestFullscreen={() => {
                                if (isFullscreen) {
                                    dismissFullscreen()
                                }
                                else {
                                    enterFullscreen()
                                }
                            }}
                            onEnd={playNext}
                        />
                    )
                }
            </VideoUrlParser>
            {
                !isFullscreen && (
                    <View style={{ flex: 1, backgroundColor: paperColor }}>
                        <View style={{
                            padding: 10
                        }}>
                            <Text style={{ color: textColor }}>选集</Text>
                        </View>
                        {
                            isEpisode ? (
                                <ScrollView contentInsetAdjustmentBehavior="automatic">
                                    <View style={{
                                        width: '100%',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        flexWrap: 'wrap'
                                    }}>
                                        {
                                            (videoInfo as Episode).m3u8_list.map(
                                                (_m3u8, index) => (
                                                    <EpisodeSelection
                                                        key={index}
                                                        active={activeEpisode === index}
                                                        onPress={
                                                            () => setActiveEpisode(index)
                                                        }
                                                    >第{index + 1}集</EpisodeSelection>
                                                )
                                            )
                                        }
                                    </View>
                                </ScrollView>
                            ) : (
                                <View style={{
                                    padding: 10
                                }}>
                                    <Text>暂无</Text>
                                </View>
                            )
                        }
                    </View>
                )
            }
        </View>
    )
}

export default Video;
