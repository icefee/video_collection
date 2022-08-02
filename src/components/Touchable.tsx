import React from 'react';
import { Pressable, type PressableProps } from 'react-native';

interface TouchableProps extends PressableProps {}

function Touchable({ children, onPress }: TouchableProps) {
    return (
        <Pressable onPress={onPress}>{children}</Pressable>
    )
}

export default Touchable;
