import React from 'react';
import { ViewProps } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function LinearGradientView({ children, ...props }: React.PropsWithChildren<ViewProps>) {
    return (
        <LinearGradient colors={[
            '#8338ec',
            '#3a86ff'
        ]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} {...props}>
            {children}
        </LinearGradient>
    )
}
