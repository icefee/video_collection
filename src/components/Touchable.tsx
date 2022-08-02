import React, { useState } from 'react';
import { Pressable, type PressableProps, Dimensions } from 'react-native';

interface TouchableProps extends PressableProps {
    onTouchUpdate?: (rate: number) => void;
}

function Touchable({ children, onTouchStart, onTouchUpdate, ...props }: TouchableProps) {
    const [touchOffset, setTouchOffset] = useState(0)
    return (
        <Pressable onTouchStart={
            (event) => {
                onTouchStart?.(event);
                setTouchOffset(event.nativeEvent.locationX)
            }
        } onTouchMove={
            (event) => {
                const width = Dimensions.get('window').width;
                const offset = event.nativeEvent.locationX - touchOffset;
                onTouchUpdate?.(offset / width);
                setTouchOffset(event.nativeEvent.locationX)
            }
        } { ...props }>{children}</Pressable>
    )
}

export default Touchable;
