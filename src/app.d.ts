/// <reference path="./video.d.ts" />

type VoidFunction = () => void;

declare module 'react-native-video' {
    import type { ClassicComponentClass } from 'react'
    import type { StyleProp, ViewStyle, ImageResizeMode } from 'react-native';

    export type ProcessParams = {
        currentTime: number;
        playableDuration: number;
        seekableDuration: number;
    }
    export type VideoMeta = {
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
        resizeMode?: Exclude<ImageResizeMode, 'center' | 'repeat'> | 'none';
        onReadyForDisplay?: VoidFunction;
        onError?: (error: any) => void;
        onLoad?: (info: VideoMeta) => void;
        onProgress?: (payload: ProcessParams) => void;
        onPlaybackStateChanged?: (payload: { isPlaying: boolean; }) => void;
        onSeek?: (payload: SeekParams) => void;
        onEnd?: VoidFunction;
        onBuffer?: (payload: { isBuffering: boolean; }) => void;
        reportBandwidth?: boolean;
        onBandwidthUpdate?: (payload: { bitrate: number; }) => void;
        style?: StyleProp<ViewStyle>
    }>;

    export interface PlayerRef {
        presentFullscreenPlayer: VoidFunction;
        dismissFullscreenPlayer: VoidFunction;
        seek(duration: number): void;
    }

    export default _default;
}

declare module 'react-native-orientation' {

    export type Orientation = 'LANDSCAPE' | 'PORTRAIT' | 'PORTRAITUPSIDEDOWN' | 'UNKNOWN';
    export type SpecificOrientation = 'LANDSCAPE-LEFT' | 'LANDSCAPE-RIGHT' | 'PORTRAIT' | 'PORTRAITUPSIDEDOWN' | 'UNKNOWN';

    type OrientationListener<T> = (listener: (orientation: T) => void) => void;
    type OrientationListenerDetail<T> = (listener: (err: Error, orientation: T) => void) => void;

    const _default: {
        getInitialOrientation: () => Orientation;
        lockToPortrait: VoidFunction;
        lockToLandscape: VoidFunction;
        lockToLandscapeLeft: VoidFunction;
        lockToLandscapeRight: VoidFunction;
        unlockAllOrientations: VoidFunction;
        addOrientationListener: OrientationListener<Orientation>;
        removeOrientationListener: OrientationListener<Orientation>;
        addSpecificOrientationListener: OrientationListener<SpecificOrientation>;
        removeSpecificOrientationListener: OrientationListener<SpecificOrientation>;
        getOrientation: OrientationListenerDetail<Orientation>;
        getSpecificOrientation: OrientationListenerDetail<SpecificOrientation>;
    };
    export default _default;
}
