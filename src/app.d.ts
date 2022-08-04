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
        minLoadRetryCount?: number;
        onReadyForDisplay?: () => void;
        onLoad?: (info: VideoInfo) => void;
        onProgress?: (payload: ProcessParams) => void;
        onPlaybackStateChanged?: (payload: { isPlaying: boolean; }) => void;
        onSeek?: (payload: SeekParams) => void;
        onEnd?: () => void;
        onBuffer?: (payload: { isBuffering: boolean; }) => void;
        reportBandwidth?: boolean;
        onBandwidthUpdate?: (payload: { bitrate: number; }) => void;
        style?: StyleProp<ViewStyle>
    }>;

    export interface PlayerRef {
        presentFullscreenPlayer(): void;
        dismissFullscreenPlayer(): void;
        seek(duration: number): void;
    }

    export default _default;
}
