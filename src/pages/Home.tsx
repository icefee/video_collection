import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hook/theme';
import LoadingIndicator from '../components/LoadingIndicator'

const shields = [
    '韩国电影',
    '纪录片'
];

async function getVideos() {
    const url = 'https://code-in-life.netlify.app/flutter/videos.json'
    const response = await fetch(url)
    const json: { videos: Section[] } = await response.json()
    // const json = html.match(
    //     new RegExp('(?<=<script id="__NEXT_DATA__" type="application/json">).+?(?=</script>)', 'g')
    // )
    return json.videos.filter(
        ({ section }) => !shields.includes(section)
    );
}

function Home() {

    const [loading, setLoading] = useState(false)
    const [videoList, setVideoList] = useState<Section[]>([])
    const { backgroundColor } = useTheme()

    const getVideoList = async () => {
        setLoading(true)
        const videos = await getVideos()
        setVideoList(videos)
        setLoading(false)
    }

    useEffect(() => {
        getVideoList()
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
            <ScrollView style={{ flex: 1, backgroundColor }} contentInsetAdjustmentBehavior="automatic">
            {
                videoList.map(
                    (section, index) => (
                        <VideoSection key={index} section={section} />
                    )
                )
            }
        </ScrollView>
    )
}

function VideoSection({ section }: { section: Section }) {
    const { paperColor } = useTheme();
    return (
        <View style={{
            margin: 5,
            backgroundColor: paperColor,
            borderRadius: 5
        }}>
            <View style={{
                padding: 10
            }}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'purple'
                }}>{section.section}</Text>
            </View>
            <ScrollView style={{
                paddingHorizontal: 10
            }} contentInsetAdjustmentBehavior="automatic">
                {
                    section.series.map(
                        (video, index) => (
                            <VideoCollection key={index} video={video} />
                        )
                    )
                }
            </ScrollView>
        </View>
    )
}

function VideoCollection({ video }: { video: Video }) {
    const navigation = useNavigation();
    const { textColor, borderColor } = useTheme();
    return (
        <Pressable onPress={() => navigation.navigate({
            name: 'video' as never,
            params: video as never
        })}>
            <View style={{
                paddingVertical: 10,
                paddingHorizontal: 5,
                borderTopWidth: 1,
                borderTopColor: borderColor,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: textColor }}>{video.title}</Text>
                    {'episodes' in video && <Text style={{ color: '#999' }}>{video.episodes}集</Text>}
                </View>
                <View>
                    <Image style={{
                        resizeMode: 'center',
                        width: 24,
                        height: 24
                    }} source={require('../assets/arrow-right.png')} />
                </View>
            </View>
        </Pressable>
    )
}

export default Home;
