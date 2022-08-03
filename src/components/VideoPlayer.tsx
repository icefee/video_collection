import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Video, { type ProcessParams, type VideoInfo, type PlayerRef } from 'react-native-video';
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
    width: number;
    height: number;
    onRequestFullscreen?: () => void;
}

function VideoPlayer({ url, width, height, onRequestFullscreen }: VideoPlayerProps) {

    const playerRef = useRef<PlayerRef>()
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

    const clearControlDismissTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = undefined;
        }
    }

    return (
        <View style={{
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        }}>
            <Touchable onTouchStart={
                () => {
                    if (controlShow) {
                        setControlShow(false);
                        clearControlDismissTimeout();
                    }
                    else {
                        setControlShow(true)
                    }
                }
            } onTouchUpdate={
                rate => {
                    setControlShow(true);
                    setSeeking(true);
                    const currentTime = Math.min(
                        totalDuration,
                        Math.max(
                            0,
                            process.currentTime + rate * totalDuration
                        )
                    );
                    playerRef.current?.seek(currentTime)
                    setProcess(params => ({
                        ...params,
                        currentTime
                    }))
                }
            } onDoubleTap={
                () => {
                    setPaused(!paused)
                }
            }>
                <Video
                    source={{ uri: url }}
                    paused={paused}
                    onReadyForDisplay={() => setLoading(false)}
                    ref={
                        /* @ts-ignore */
                        ref => playerRef.current = ref
                    }
                    onLoad={
                        ({ duration }: VideoInfo) => {
                            setTotalDuration(duration)
                        }
                    }
                    onSeek={
                        () => { }
                    }
                    onPlaybackStateChanged={
                        ({ isPlaying }) => {
                            if (isPlaying) {
                                timeoutRef.current = setTimeout(() => setControlShow(false), 3000)
                            }
                            else {
                                clearControlDismissTimeout()
                            }
                        }
                    }
                    onProgress={
                        (params: ProcessParams) => {
                            if (!seeking) {
                                setProcess(params)
                            }
                        }
                    }
                    style={{ width, height }}
                />
            </Touchable>
            <FadeView in={controlShow && !loading} duration={250} style={{
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
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 10
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity onPress={
                            () => setPaused(!paused)
                        }>
                            <Image style={{
                                width: 30,
                                height: 30,
                                resizeMode: 'contain'
                            }} source={paused ? require('../assets/play.png') : require('../assets/pause.png')} />
                        </TouchableOpacity>
                        <Text style={{ color: '#fff', marginLeft: 15 }}>{timeFormatter(process.currentTime) + ' / ' + timeFormatter(totalDuration)}</Text>
                    </View>
                    <TouchableOpacity onPress={onRequestFullscreen}>
                        <Image style={{
                            width: 25,
                            height: 25,
                            resizeMode: 'center'
                        }} source={require('../assets/fullscreen.png')} />
                    </TouchableOpacity>
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