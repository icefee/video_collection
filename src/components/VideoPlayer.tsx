import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, AppState, Dimensions, Pressable, type AppStateStatus, type GestureResponderEvent } from 'react-native';
import Video, { type ProcessParams, type VideoInfo, type PlayerRef } from 'react-native-video';
import Touchable from '../components/Touchable';
import { FadeView } from './Animated';
import LoadingIndicator from './LoadingIndicator';
import { useBitSize } from '../hook/byteSize';

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
    fullscreen: boolean;
    onRequestFullscreen?: () => void;
    onEnd?: () => void;
}

function VideoPlayer({ url, width, height, fullscreen, onRequestFullscreen, onEnd }: VideoPlayerProps) {

    const playerRef = useRef<PlayerRef>()
    const timeoutRef = useRef<number>();
    const [paused, setPaused] = useState(false)
    const [seeking, setSeeking] = useState(false)
    const [controlShow, setControlShow] = useState(true)
    const [totalDuration, setTotalDuration] = useState(0)

    const [isBuffering, setIsBuffering] = useState(false)

    const [bitSize, setBitrate] = useBitSize(0)

    const [process, setProcess] = useState<ProcessParams>({
        currentTime: 0,
        playableDuration: 0,
        seekableDuration: 0
    });

    const createControlDismissTimeout = () => {
        clearControlDismissTimeout();
        timeoutRef.current = setTimeout(() => setControlShow(false), 7.5e3)
    }

    const clearControlDismissTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = undefined;
        }
    }

    const appState = useRef(AppState.currentState);

    const _handleAppStateChange = (state: AppStateStatus) => {
        if (
            appState.current.match(/inactive|background|active/) &&
            state === 'active'
        ) {
            setPaused(false);
        }
        else {
            clearControlDismissTimeout();
            setPaused(true);
        }
        appState.current = state;
    }

    useEffect(() => {
        setProcess({
            currentTime: 0,
            playableDuration: 0,
            seekableDuration: 0
        })
    }, [url])

    useEffect(() => {

        const listener = AppState.addEventListener('change', _handleAppStateChange);

        return () => {
            listener.remove();
            clearControlDismissTimeout()
        }
    }, []);

    const processBar = useMemo(() => {
        return (
            <Pressable onPress={
                (event: GestureResponderEvent) => {
                    const currentTime = event.nativeEvent.pageX * totalDuration / Dimensions.get('window').width;
                    setProcess(params => ({
                        ...params,
                        currentTime
                    }))
                    setSeeking(true)
                    playerRef.current?.seek(currentTime)
                }
            }>
                <View style={{
                    position: 'relative',
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, .3)',
                    height: 5,
                    flex: 1,
                    borderRadius: 5,
                    overflow: 'hidden'
                }}>
                    <View style={{
                        position: 'absolute',
                        left: 0,
                        width: process.playableDuration * 100 / totalDuration + '%',
                        backgroundColor: 'rgba(255, 255, 255, .5)',
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
            </Pressable>
        )
    }, [process, totalDuration])

    return (
        <View style={{
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        }}>
            <Touchable onPress={
                () => {
                    if (controlShow) {
                        setControlShow(false);
                        clearControlDismissTimeout();
                    }
                    else {
                        setControlShow(true)
                        createControlDismissTimeout();
                    }
                }
            } onTouchUpdate={
                rate => {
                    setControlShow(true);
                    clearControlDismissTimeout();
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
                    minLoadRetryCount={20}
                    resizeMode="contain"
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
                        () => {
                            setSeeking(false)
                            createControlDismissTimeout()
                        }
                    }
                    onEnd={onEnd}
                    onPlaybackStateChanged={
                        ({ isPlaying }) => {
                            if (isPlaying) {
                                createControlDismissTimeout()
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
                    onBuffer={
                        ({ isBuffering }) => setIsBuffering(isBuffering)
                    }
                    reportBandwidth
                    onBandwidthUpdate={
                        ({ bitrate }) => setBitrate(bitrate)
                    }
                    style={{ width, height }}
                />
            </Touchable>
            <FadeView in={controlShow || isBuffering} duration={250} style={{
                position: 'absolute',
                bottom: 0,
                padding: 10,
                width: '100%',
                backgroundColor: 'rgba(0, 0, 0, .6)'
            }}>
                {processBar}
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
                        {
                            isBuffering ? (
                                <View style={{
                                    width: 30,
                                    height: 30,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <LoadingIndicator color="#fff" size={25} />
                                </View>
                            ) : (
                                <TouchableOpacity onPress={
                                    () => setPaused(!paused)
                                }>
                                    <Image style={{
                                        width: 30,
                                        height: 30,
                                        resizeMode: 'contain'
                                    }} source={paused ? require('../assets/play.png') : require('../assets/pause.png')} />
                                </TouchableOpacity>
                            )
                        }
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
            <FadeView in={!controlShow && !isBuffering} duration={200} style={{
                position: 'absolute',
                width: '100%',
                bottom: 0
            }}>{processBar}</FadeView>
            <View style={{
                position: 'absolute',
                right: 10,
                top: fullscreen ? 30 : 10
            }}>
                <Text style={{ color: '#fff', fontSize: 12 }}>{bitSize}</Text>
            </View>
        </View>
    )
}

export default VideoPlayer;