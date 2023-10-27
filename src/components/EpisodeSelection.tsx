import React from 'react';
import { View, TouchableHighlight, Text, type StyleProp, type ViewStyle } from 'react-native';
import LinearGradientView from '../components/LinearGradientView';
import { useTheme } from '../hook/theme';

function EpisodeSelection({ active, children, onPress }: { active: boolean, children: React.ReactNode, onPress?: () => void }) {

    const { textColor, isDark } = useTheme()

    const viewStyle: StyleProp<ViewStyle> = {
        borderWidth: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: textColor,
        backgroundColor: active ? 'purple' : 'transparent'
    }

    const textStyle = {
        color: (active || isDark) ? '#fff' : textColor
    }

    const text = (
        <Text style={textStyle}>{children}</Text>
    )

    return (
        <View style={{
            width: '20%',
            padding: 5
        }}>
            {
                active ? (
                    <LinearGradientView style={viewStyle}>
                        {text}
                    </LinearGradientView>
                ) : (
                    <TouchableHighlight underlayColor="transparent" style={viewStyle} onPress={onPress}>
                        {text}
                    </TouchableHighlight>
                )
            }
        </View>
    )
}

export default EpisodeSelection