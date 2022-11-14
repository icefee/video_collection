import React from 'react';
import { Text } from 'react-native';
import LinearGradientView from '../components/LinearGradientView';

type ListHeaderProps = {
    title: string;
}

export default function ListHeader({ title }: ListHeaderProps) {
    return (
        <LinearGradientView style={{
            padding: 8,
            opacity: .75
        }}>
            <Text style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: 'white'
            }}>{title}</Text>
        </LinearGradientView>
    )
}
