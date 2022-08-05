import React, { useState } from 'react';
import { Pressable, type PressableProps, type GestureResponderEvent, Dimensions } from 'react-native';

interface TouchableProps extends PressableProps {
    onTouchUpdate?: (rate: number) => void;
    onDoubleTap?: () => void;
}

function Touchable({ children, onTouchStart, onTouchUpdate, onDoubleTap, onPress, ...props }: TouchableProps) {
    const [touchOffset, setTouchOffset] = useState(0)
    const [firstTap, setFirstTap] = useState<number | null>(null)
    const [isTouching, setIsTouching] = useState(false)
    const releaseTouching = () => setIsTouching(false)
    
    const handlePress = (event: GestureResponderEvent) => {
        if (!firstTap) {
            setFirstTap(+new Date())
            onPress?.(event)
        }
        else {
            const now = Date.now();
            if(now - firstTap < 400) {
                onDoubleTap?.()
            }
            else {
                onPress?.(event)
            }
            setFirstTap(now)
        }
    }

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
                if (Math.abs(offset) > 2) {
                    setIsTouching(true)
                }
                if (isTouching) {
                    onTouchUpdate?.(offset / width);
                }
                setTouchOffset(event.nativeEvent.locationX)
            }
        } onPress={handlePress} onTouchEnd={releaseTouching} onTouchCancel={releaseTouching} { ...props }>{children}</Pressable>
    )
}

export default Touchable;
