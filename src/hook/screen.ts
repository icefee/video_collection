import { useState, useMemo, useEffect } from 'react';
import { Dimensions } from 'react-native';
import Orientation, { type Orientation as OrientationType } from 'react-native-orientation';

export function useWindowSize() {
    const [size, setSize] = useState(
        Dimensions.get('window')
    )

    const width = useMemo(() => Math.min(
        size.width,
        size.height
    ), [size])

    const height = useMemo(() => Math.max(
        size.width,
        size.height
    ), [size])

    const orientationListener = (orientation: OrientationType) => {
        setSize(
            Dimensions.get('window')
        )
    }

    useEffect(() => {
        Orientation.addOrientationListener(orientationListener)
        return () => Orientation.removeOrientationListener(orientationListener)
    }, [])

    return [width, height]
}
