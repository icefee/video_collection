import React from 'react';
import Spinner from 'react-native-spinkit';

export default function LoadingIndicator({ color = '#8338ec', size = 50 }) {
    return (
        <Spinner color={color} isVisible size={size} type="FadingCircleAlt" />
    )
}
