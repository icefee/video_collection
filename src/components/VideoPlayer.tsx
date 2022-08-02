import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Image, ActivityIndicator, Dimensions } from 'react-native';
import Video, { type ProcessParams, type VideoInfo } from 'react-native-video';
import Touchable from '../components/Touchable';
import { FadeView } from './Animated';

function timeFormatter(sf: number): string {
    const s = Math.round(sf)
    const [m, h] = [60, 60 * 60]
    return [...(s < h ? [] : [Math.floor(s / h)]), Math.floor((s < h ? s : s % h) / m), s % m].map(
        v => String(v).padStart(2, '0')
    ).join(':')
}

interface VideoPlayerProps {
    url: string;
}

function VideoPlayer({ url }: VideoPlayerProps) {

    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef<number>();

    const [paused, setPaused] = useState(false)
    const [seeking, setSeeking] = useState(false)

    const [controlShow, setControlShow] = useState(true)

    const [totalDuration, setTotalDuration] = useState(0)

    const [process, setProcess] = useState<ProcessParams>({
        currentTime: 0,
        playableDuration: 0,
        seekableDuration: 0
    });

    useEffect(() => {
        setLoading(true);
    }, [url])

    return (
        <View style={{
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        }}>
            <Touchable onPress={
                () => setControlShow(true)
            }>
                <Video
                    source={{ uri: url }}
                    paused={paused}
                    onReadyForDisplay={() => setLoading(false)}
                    onLoad={
                        ({ duration }: VideoInfo) => {
                            setTotalDuration(duration)
                        }
                    }
                    onPlaybackStateChanged={
                        ({ isPlaying }) => {
                            if (isPlaying) {
                                timeoutRef.current = setTimeout(() => setControlShow(false), 3000)
                            }
                            else if (timeoutRef.current) {
                                clearTimeout(timeoutRef.current)
                                timeoutRef.current = undefined;
                            }
                        }
                    }
                    onProgress={
                        (params: ProcessParams) => {
                            setProcess(params)
                        }
                    }
                    style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height * .4
                    }}
                />
            </Touchable>
            {
                controlShow && !loading && (
                    <View style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)'
                    }}>
                        <TouchableWithoutFeedback onPress={
                            () => setControlShow(false)
                        }>
                            <View style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                right: 0,
                                bottom: 0,
                            }} />
                        </TouchableWithoutFeedback>
                        <TouchableOpacity onPress={
                            () => setPaused(!paused)
                        }>
                            <Image style={{
                                width: 40,
                                height: 40,
                                opacity: .8,
                                resizeMode: 'contain'
                            }} source={paused ? require('../assets/play.png') : require('../assets/pause.png')} />
                        </TouchableOpacity>
                    </View>
                )
            }
            <FadeView in={controlShow} duration={250} style={{
                position: 'absolute',
                bottom: 0,
                padding: 10,
                width: '100%',
                backgroundColor: 'rgba(0, 0, 0, .6)'
            }}>
                <View style={{
                    position: 'relative',
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, .3)',
                    height: 3,
                    flex: 1,
                }}>
                    <View style={{
                        position: 'absolute',
                        left: 0,
                        width: process.playableDuration * 100 / totalDuration + '%',
                        backgroundColor: 'rgba(128, 0, 128, .4)',
                        height: '100%'
                    }} />
                    <View style={{
                        position: 'absolute',
                        left: 0,
                        width: process.currentTime * 100 / totalDuration + '%',
                        backgroundColor: 'purple',
                        height: '100%'
                    }} />
                </View>
                <View style={{
                    flexDirection: 'row',
                    marginTop: 10
                }}>
                    <Text style={{ color: '#fff' }}>{timeFormatter(process.currentTime) + ' / ' + timeFormatter(totalDuration)}</Text>
                </View>
            </FadeView>
            {
                loading && (
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'transparent'
                    }}>
                        <ActivityIndicator size="large" color="purple" />
                    </View>
                )
            }
        </View>
    )
}

export default VideoPlayer;