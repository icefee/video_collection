import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';

interface VideoPlayerProps {
    url: string;
}

function VideoPlayer({ url }: VideoPlayerProps) {

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
    }, [url])

    return (
        <View style={{
            backgroundColor: '#000',
            height: '40%',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        }}>
            <Video
                source={{ uri: url }}
                controls
                onReadyForDisplay={() => setLoading(false)}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
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