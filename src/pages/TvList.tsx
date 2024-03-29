import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hook/theme';
import { assetUrl } from '../config';
import LoadingIndicator from '../components/LoadingIndicator';

async function getTVChannels() {
    const data = await fetch(`${assetUrl}/api/video/tv?inherit=1`).then<TVChannel[]>(
        response => response.json()
    )
    return data;
}

interface TVChannelProps {
    data: TVChannel[];
}

function TVChannel({ data }: TVChannelProps) {
    const navigation = useNavigation();
    const { textColor, backgroundColor, paperColor, borderColor } = useTheme();

    return (
        <ScrollView
            style={{
                backgroundColor
            }} contentInsetAdjustmentBehavior="automatic">
            <View style={{
                padding: 5
            }}>
                <View style={{
                    backgroundColor: paperColor,
                    borderRadius: 5
                }}>
                    {
                        data.map(
                            (channel, index) => (
                                <Pressable key={channel.id} onPress={() => navigation.navigate({
                                    name: 'live_player',
                                    params: channel
                                } as never)}>
                                    <View style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 5,
                                        borderTopWidth: 1,
                                        borderTopColor: index === 0 ? 'transparent' : borderColor,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <View>
                                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: textColor }}>{channel.title}</Text>
                                        </View>
                                        <View>
                                            <Image
                                                style={{
                                                    resizeMode: 'center',
                                                    width: 24,
                                                    height: 24
                                                }}
                                                source={require('../assets/arrow-right.png')}
                                            />
                                        </View>
                                    </View>
                                </Pressable>
                            )
                        )
                    }
                </View>
            </View>
        </ScrollView>
    )
}

function TvList() {

    const [loading, setLoading] = useState(false)
    const [tvChannels, setTvChannels] = useState<TVChannel[]>([])
    const { backgroundColor } = useTheme()

    const getChannels = async () => {
        setLoading(true)
        const channels = await getTVChannels()
        setTvChannels(channels)
        setLoading(false)
    }

    useEffect(() => {
        getChannels()
    }, [])

    return loading ? (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor,
        }}>
            <LoadingIndicator />
        </View>
    ) : (
        <TVChannel data={tvChannels} />
    )
}

export default TvList;
