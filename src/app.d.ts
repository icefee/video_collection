/// <reference path="./video.d.ts" />

declare module 'react-native-video' {
    import type { ClassicComponentClass } from 'react'
    import type { StyleProp, ViewStyle } from 'react-native';

    export type ProcessParams = {
        currentTime: number;
        playableDuration: number;
        seekableDuration: number;
    }
    export type VideoInfo = {
        duration: number;
    }
    export type SeekParams = {
        currentTime: number;
        seekTime: number;
    }
    const _default: ClassicComponentClass<{
        source: {
            uri: string;
        };
        controls?: boolean;
        paused?: boolean;
        onReadyForDisplay?: () => void;
        onLoad?: (info: VideoInfo) => void;
        onProgress?: (params: ProcessParams) => void;
        onPlaybackStateChanged?: (params: { isPlaying: boolean; }) => void;
        onSeek?: (params: SeekParams) => void;
        style?: StyleProp<ViewStyle>
    }>;

    export interface PlayerRef {
        presentFullscreenPlayer(): void;
        dismissFullscreenPlayer(): void;
        seek(duration: number): void;
    }

    export default _default;
}
