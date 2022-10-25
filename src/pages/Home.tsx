import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hook/theme';
import LoadingIndicator from '../components/LoadingIndicator'
import LinearGradientView from '../components/LinearGradientView';

const shields = [
    '韩国电影',
    '纪录片',
    '私密'
];

const apiUrl = 'https://code-in-life.netlify.app';

async function getVideos() {
    const url = apiUrl + '/videos.json'
    const response = await fetch(url)
    const json: { videos: Section[] } = await response.json()
    // const json = html.match(
    //     new RegExp('(?<=<script id="__NEXT_DATA__" type="application/json">).+?(?=</script>)', 'g')
    // )
    return json.videos.filter(
        ({ section }) => !shields.includes(section)
    );
}

async function getTVChannels() {
    const url = apiUrl + '/iptv.json'
    const data: TVChannel[] = await fetch(url).then(
        response => response.json()
    )
    return data;
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
            <TVChannelSection />
        </ScrollView>
    )
}

type ListHeaderProps = {
    title: string;
}

function ListHeader({ title }: ListHeaderProps) {
    return (
        <LinearGradientView style={{
            padding: 10
        }}>
            <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: 'white'
            }}>{title}</Text>
        </LinearGradientView>
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
            <ListHeader title={section.section} />
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
            name: 'video',
            params: video
        } as never)}>
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

function TVChannelSection() {
    const navigation = useNavigation();
    const { textColor, paperColor, borderColor } = useTheme();
    
    const [tvChannels, setTvChannels] = useState<TVChannel[]>([])

    useEffect(() => {
        getTVChannels().then(
            data => {
                setTvChannels(data)
            }
        )
    }, [])

    return (
        <View style={{
            margin: 5,
            backgroundColor: paperColor,
            borderRadius: 5
        }}>
            <ListHeader title="电视直播" />
            <ScrollView style={{
                paddingHorizontal: 10
            }} contentInsetAdjustmentBehavior="automatic">
                {
                    tvChannels.map(
                        (channel) => (
                            <Pressable key={channel.id} onPress={() => navigation.navigate({
                                name: 'tv',
                                params: channel
                            } as never)}>
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
                                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: textColor }}>{channel.title}</Text>
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
                    )
                }
            </ScrollView>
        </View>
    )
}

export default Home;
