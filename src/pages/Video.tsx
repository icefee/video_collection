import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, TouchableHighlight, Text, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import VideoPlayer from '../components/VideoPlayer';
import { useTheme } from '../hook/theme';

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
    const { paperColor, textColor } = useTheme()

    const videoInfo = useMemo<Video>(
        () => route.params as Video,
        [route]
    )
    const isEpisode = useMemo<boolean>(
        () => 'episodes' in videoInfo,
        [videoInfo]
    )
    const [playingUrl, setPlayingUrl] = useState('')

    useEffect(() => {
        if (isEpisode) {
            const video = videoInfo as Episode;
            setPlayingUrl(
                getM3u8Uri(video.url_template!, video.m3u8_list[0])
            )
        }
        else {
            const video = videoInfo as Film;
            setPlayingUrl(video.m3u8_url)
        }
        navigation.setOptions({
            title: videoInfo.title,
        })
    }, [])

    return (
        <View style={{ flex: 1 }}>
            {playingUrl === '' ? <ActivityIndicator /> : <VideoPlayer url={playingUrl} />}
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
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignContent: 'center',
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap'
                                }}>
                                    {
                                        (videoInfo as Episode).m3u8_list.map(
                                            (m3u8, index) => (
                                                <EpisodeSelection
                                                    key={index}
                                                    active={getM3u8Uri((videoInfo as Episode).url_template!, m3u8) === playingUrl}
                                                    onPress={
                                                        () => setPlayingUrl(
                                                            getM3u8Uri((videoInfo as Episode).url_template!, m3u8)
                                                        )
                                                    }
                                                >第{index + 1}集</EpisodeSelection>
                                            )
                                        )
                                    }
                                </View>
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
        </View>
    )
}

function EpisodeSelection({ active, children, onPress }: { active: boolean, children: React.ReactNode, onPress: () => void }) {

    const { textColor, backgroundColor } = useTheme()

    const viewStyle = {
        borderColor: textColor,
        backgroundColor: active ? 'purple' : 'transparent'
    }

    const textStyle = {
        color: textColor
    }

    return (
        <View style={{
            width: '20%',
            padding: 5
        }}>
            <TouchableHighlight underlayColor="purple" style={{
                borderWidth: 2,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                ...viewStyle
            }} onPress={onPress}>
                <Text style={{ ...textStyle }}>{children}</Text>
            </TouchableHighlight>
        </View>
    )
}

export default Video;
