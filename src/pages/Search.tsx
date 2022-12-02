import React, { useEffect, useState, useMemo } from 'react';
import { View, Image, TextInput, ScrollView, Text, TouchableOpacity, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoadingIndicator from '../components/LoadingIndicator';
import { apiUrl } from '../config';
import { useTheme } from '../hook/theme';
import { jsonBase64, image as imageParser } from '../util/parser';

async function getSearch(s: string): Promise<SearchVideo[]> {

    const result = await fetch(
        apiUrl + '/video/search/api?s=' + encodeURIComponent(s)
    ).then(
        response => jsonBase64<SearchVideo[]>(response)
    )
    return result ?? [];

}

async function getVideo(site: string, id: number): Promise<VideoInfo | null> {

    const result = await fetch(
        apiUrl + `/video/api?api=${site}&id=${id}`
    ).then(
        response => jsonBase64<VideoInfo>(response)
    )

    return result;
}

function Search() {

    const [keyword, setKeyword] = useState('')
    const [videoList, setVideoList] = useState<SearchVideo[]>([])
    const [loading, setLoading] = useState(false)
    const [searchComplate, setSearchComplate] = useState(false)

    const { backgroundColor, textColor, paperColor, borderColor, backdropColor } = useTheme()
    const navigation = useNavigation();

    const showToast = (msg: string) => ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.BOTTOM)

    const getSearchResult = async (s: string) => {

        setLoading(true)

        const result = await getSearch(s)

        if (result.length === 0) {
            showToast('没有搜索到相关内容')
        }

        setSearchComplate(true)
        setVideoList(result)
        setLoading(false)

    }

    const getVideoList = async (video: VideoListItem, siteKey: string) => {

        setLoading(true)

        const result = await getVideo(siteKey, video.id)

        if (result) {

            const videoList = result.dataList[0]
            const urls = videoList.urls;

            const data = Object.assign({
                title: result.name,
            }, urls.length > 1 ? {
                episodes: urls.length,
                url_template: '{0}',
                m3u8_list: urls.map(
                    ({ url }) => [url]
                )
            } : {
                m3u8_url: urls[0].url
            })
            navigation.navigate({
                name: 'video_player',
                params: data
            } as never)
        }
        else {
            showToast('数据访问错误, 请重试')
        }

        setLoading(false)
    }

    const onSubmit = () => {
        if (keyword.trim().length > 0) {
            getSearchResult(keyword)
        }
        else {
            showToast('关键词不能为空')
        }
    }

    const withOverlay = (content: React.ReactNode) => {
        return (
            <View style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: backdropColor,
            }}>
                {content}
            </View>
        )
    }

    return (
        <View style={{
            height: '100%'
        }}>
            <View style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                padding: 5,
                zIndex: 20,
                borderColor,
                borderTopWidth: 1,
                backgroundColor: paperColor
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor,
                    borderRadius: 5
                }}>
                    <View style={{
                        padding: 8,
                        paddingRight: 0
                    }}>
                        <Image style={{
                            resizeMode: 'center',
                            width: 20,
                            height: 20
                        }} source={require('../assets/icon_search.png')} />
                    </View>
                    <TextInput
                        style={{
                            height: 40,
                            padding: 10,
                            flexGrow: 1
                        }}
                        returnKeyType="search"
                        placeholder="输入影视剧名称"
                        onChangeText={value => setKeyword(value)}
                        onSubmitEditing={onSubmit}
                        value={keyword}
                        autoFocus
                    />
                </View>
            </View>
            <View style={{
                position: 'relative',
                paddingTop: 50,
                flexGrow: 1
            }}>
                <ScrollView style={{ backgroundColor }} contentInsetAdjustmentBehavior="automatic">
                    {
                        videoList.map(
                            site => (
                                <View key={site.key} style={{
                                    padding: 10,
                                    marginBottom: 5
                                }}>
                                    <View style={{
                                        marginBottom: 5
                                    }}>
                                        <Text>{site.name}</Text>
                                    </View>
                                    <View>
                                        {
                                            site.data.map(
                                                video => (
                                                    <TouchableOpacity key={video.id} style={{
                                                        marginBottom: 10
                                                    }} onPress={
                                                        () => getVideoList(video, site.key)
                                                    }>
                                                        <View style={{
                                                            backgroundColor: paperColor,
                                                            padding: 10,
                                                            borderRadius: 6,
                                                            flexDirection: 'row'
                                                        }}>
                                                            <Poster
                                                                width={80}
                                                                height={120}
                                                                api={site.key}
                                                                id={video.id}
                                                            />
                                                            <View style={{
                                                                flexGrow: 1,
                                                                marginLeft: 8
                                                            }}>
                                                                <View>
                                                                    <Text style={{
                                                                        fontSize: 20,
                                                                        fontWeight: 'bold',
                                                                        color: textColor
                                                                    }}>{video.name}</Text>
                                                                </View>
                                                                <View style={{
                                                                    marginVertical: 8
                                                                }}>
                                                                    {
                                                                        Boolean(video.note) && (
                                                                            <Text>{video.note}</Text>
                                                                        )
                                                                    }
                                                                </View>
                                                                <View>
                                                                    <Tag>{video.type}</Tag>
                                                                </View>
                                                                <View style={{
                                                                    flexGrow: 1,
                                                                    justifyContent: 'flex-end',
                                                                    alignItems: 'flex-end'
                                                                }}>
                                                                    <Text>{video.last}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            )
                                        }
                                    </View>
                                </View>
                            )
                        )
                    }
                </ScrollView>
                {
                    loading && withOverlay(<LoadingIndicator />)
                }
                {
                    searchComplate && videoList.length === 0 && withOverlay(<Text>找不到相关内容</Text>)
                }
            </View>
        </View>
    )
}

interface PosterProps {
    width: number | string;
    height: number | string;
    api: string;
    id: number;
}

function Poster({ width, height, api, id }: PosterProps) {

    const { backgroundColor } = useTheme()
    const [src, setSrc] = useState<string | null>(null)
    const [pending, setPending] = useState(false)
    const [error, setError] = useState(false)

    const getPoster = async (api: string, id: number) => {
        setPending(true)
        try {

            const poster = await fetch(
                apiUrl + `/video/${api}/${id}/poster`
            ).then(response => imageParser(response))

            if (poster) {
                setSrc(poster)
            }
            else {
                throw new Error('')
            }
        }
        catch (error) {
            setError(true)
        }

        setPending(false)

    }

    useEffect(() => {
        getPoster(api, id)
    }, [api, id])

    const onLoad = () => setPending(false)
    const onError = () => {
        setError(true)
        setPending(false)
    }

    const overlayWrapper = (child: React.ReactNode) => (
        <View style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {child}
        </View>
    )

    const stateOverlay = useMemo(() => {
        if (pending) {
            return overlayWrapper(
                <Text>加载中</Text>
            )
        }
        if (error) {
            return overlayWrapper(
                <Text style={{
                    color: '#f24'
                }}>加载失败</Text>
            )
        }
        return null;
    }, [pending, error])

    return (
        <View style={{
            position: 'relative',
            width,
            height,
            backgroundColor
        }}>
            {
                src && (
                    <Image
                        style={{
                            width,
                            height,
                            resizeMode: 'cover'
                        }}
                        source={{
                            uri: src
                        }}
                        onLoad={onLoad}
                        onError={onError}
                    />
                )
            }
            {stateOverlay}
        </View>
    )
}

interface TagProps {
    children: string;
}

function Tag({ children }: TagProps) {
    return (
        <View style={{
            padding: 3,
            borderWidth: 1,
            borderColor: '#5517e3',
            borderRadius: 10,
            alignSelf: 'flex-start'
        }}>
            <Text style={{
                color: '#5517e3',
                fontSize: 12
            }}>{children}</Text>
        </View>
    )
}

export default Search;
