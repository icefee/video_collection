/// <reference path="./video.d.ts" />

declare module 'react-native-video' {
    import type { FC } from 'react'
    import type { StyleProp, ViewStyle } from 'react-native';
    const _default: FC<{
        source: {
            uri: string;
        };
        controls?: boolean;
        onReadyForDisplay?: () => void;
        style?: StyleProp<ViewStyle>
    }>;
    export default _default;
}
