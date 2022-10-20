import React from 'react';
import { View, Pressable, Dimensions, type StyleProp, type GestureResponderEvent, type ViewStyle } from 'react-native';
import LinearGradientView from './LinearGradientView';

type ProcessBarProps = {
    buffered: number;
    played: number;
    onSeek?: (loc: number) => void;
    minimize?: boolean;
}

function ProcessBar({ buffered, played, onSeek, minimize = false }: ProcessBarProps) {

    const barHeight = minimize ? 2 : 6;
    const commonStyle: StyleProp<ViewStyle> = {
        position: 'absolute',
        top: minimize ? 0 : 2,
        left: 0,
    }

    const bar = (
        <View style={{
            position: 'relative',
            width: '100%',
            height: barHeight,
            flex: 1,
            overflow: 'hidden'
        }}>
            <View style={{
                ...commonStyle,
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, .3)',
                height: 2
            }} />
            <View style={{
                ...commonStyle,
                width: buffered * 100 + '%',
                backgroundColor: 'rgba(255, 255, 255, .5)',
                height: 2
            }} />
            <LinearGradientView style={{
                ...commonStyle,
                width: played * 100 + '%',
                height: 2
            }} />
        </View>
    )

    if (minimize) {
        return bar;
    }

    return (
        <View style={{
            paddingLeft: 5,
            paddingRight: 5
        }}>
            <Pressable onPress={
                (event: GestureResponderEvent) => {
                    const locate = event.nativeEvent.pageX / (Dimensions.get('window').width - 10);
                    onSeek?.(locate)
                }
            }>
                {bar}
            </Pressable>
        </View>
    )
}

export default ProcessBar;
