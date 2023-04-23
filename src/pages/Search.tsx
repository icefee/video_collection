import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Image, TextInput, SectionList, Text, TouchableOpacity, Button, Dimensions, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoadingIndicator from '../components/LoadingIndicator';
import { getSearchResult, getVideoDetail } from '../util/api';
import { useTheme } from '../hook/theme';
import { usePersistentStorage } from '../hook/storage';
import { apiUrl, assetUrl } from '../config';
import { showToast } from '../util/toast';
import ApiSource from './ApiSource';

function Search() {

    const [keyword, setKeyword] = useState('')
    const [videoList, setVideoList] = useState<SearchVideo[]>([])
    const [loading, setLoading] = useState(false)
    const [searchComplate, setSearchComplate] = useState(false)

    const { textColor, subTextColor, paperColor, borderColor, backdropColor } = useTheme()
    const navigation = useNavigation();
    const [apiSource, setApiSource] = usePersistentStorage<{
        data: ApiSource[],
        update: number
    }>('__api_source', {
        data: [],
        update: 0
    })

    const inputFieldRef = useRef<TextInput | null>(null)

    const getApiSource = async () => {
        if (apiSource.data.length === 0) {
            const apiSources = await ApiSource.fetchApiSource();
            if (apiSources) {
                setApiSource({
                    data: apiSources,
                    update: +new Date
                })
                return apiSources;
            }
            else {
                showToast('数据源获取失败')
            }
        }
        return apiSource.data;
    }

    const getSearch = async (s: string) => {

        setLoading(true)
        const sources = await getApiSource()
        if (sources) {
            let prefer = false;
            let wd = s;
            if (s.startsWith('$')) {
                prefer = true;
                wd = s.slice(1)
            }
            const result = await getSearchResult(sources, {
                wd: encodeURIComponent(wd),
                prefer
            })
            if (result.length === 0) {
                showToast('没有搜索到相关内容')
            }
            setSearchComplate(true)
            setVideoList(result)
        }
        setLoading(false)

    }

    const getVideoList = async (video: VideoListItem, siteKey: string) => {
        setLoading(true)
        const sources = await getApiSource()
        if (sources) {
            const result = await getVideoDetail(sources, siteKey, video.id)
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
        }
        setLoading(false)
    }

    const onSubmit = () => {
        if (keyword.trim().length > 0) {
            getSearch(keyword)
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
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: backdropColor,
            }}>
                <View style={{
                    padding: 15,
                    backgroundColor: 'rgba(0, 0, 0, .8)',
                    borderRadius: 6
                }}>
                    {content}
                </View>
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
                    position: 'relative',
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor,
                    borderRadius: 5,
                    paddingRight: 25
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
                            flexGrow: 1,
                            color: textColor
                        }}
                        ref={inputFieldRef}
                        returnKeyType="search"
                        placeholder="输入影视剧名称"
                        onChangeText={value => setKeyword(value)}
                        placeholderTextColor={subTextColor}
                        onSubmitEditing={onSubmit}
                        value={keyword}
                        autoFocus
                    />
                    {
                        keyword !== '' && (
                            <TouchableOpacity style={{
                                position: 'absolute',
                                top: 5,
                                right: 5,
                                padding: 5
                            }} onPress={
                                () => {
                                    setKeyword('');
                                    inputFieldRef.current?.focus();
                                }
                            }>
                                <Image style={{
                                    resizeMode: 'center',
                                    width: 20,
                                    height: 20
                                }} source={require('../assets/clear.png')} />
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>
            <View style={{
                position: 'relative',
                paddingTop: 50,
                flexGrow: 1
            }}>
                <SectionList
                    sections={videoList}
                    keyExtractor={(item, index) => `${index}-${item.id}`}
                    renderItem={({ item, section }) => (
                        <TouchableOpacity style={{
                            paddingBottom: 5,
                            marginBottom: 5,
                            borderBottomWidth: 1,
                            borderBottomColor: borderColor
                        }} onPress={
                            () => getVideoList(item, section.key)
                        }>
                            <View style={{
                                backgroundColor: paperColor,
                                padding: 10,
                                borderRadius: 6,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <Poster
                                    width={120}
                                    height={180}
                                    src={`${apiUrl}/api/video/${section.key}/${item.id}?type=poster`}
                                />
                                <View style={{
                                    width: Dimensions.get('window').width - 150
                                }}>
                                    <View style={{
                                        flexBasis: '100%'
                                    }}>
                                        <Text style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            color: textColor
                                        }} numberOfLines={2} textBreakStrategy="simple">{item.name}</Text>
                                    </View>
                                    <View style={{
                                        marginVertical: 8
                                    }}>
                                        {
                                            Boolean(item.note) && (
                                                <Text style={{
                                                    color: textColor
                                                }}>{item.note}</Text>
                                            )
                                        }
                                    </View>
                                    <View>
                                        <Tag>{item.type}</Tag>
                                    </View>
                                    <View style={{
                                        marginTop: 10
                                    }}>
                                        <Text style={{
                                            color: subTextColor
                                        }}>{item.last}</Text>
                                    </View>
                                    <View style={{
                                        flexGrow: 1,
                                        flexDirection: 'row',
                                        alignItems: 'flex-end'
                                    }}>
                                        <Button
                                            title="网页播放"
                                            color="#5517e3"
                                            onPress={
                                                () => {
                                                    Linking.openURL(
                                                        assetUrl + '/video?api=' + section.key + '&id=' + item.id
                                                    )
                                                }
                                            }
                                        />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    renderSectionHeader={({ section: { name, rating } }) => (
                        <View style={{
                            paddingHorizontal: 8,
                            paddingTop: 24,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                color: '#fff'
                            }}>{name}</Text>
                            <RatingScore score={rating} />
                        </View>
                    )}
                />
                {
                    loading && withOverlay(<LoadingIndicator />)
                }
                {
                    searchComplate && videoList.length === 0 && withOverlay(<Text style={{
                        color: textColor
                    }}>找不到相关内容</Text>)
                }
            </View>
        </View>
    )
}

interface PosterProps {
    src: string;
    width: number | string;
    height: number | string;
}

function Poster({ src, width, height }: PosterProps) {

    const { backgroundColor, backdropColor } = useTheme()
    const [pending, setPending] = useState(false)
    const [error, setError] = useState(false)

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
            alignItems: 'center',
            backgroundColor: backdropColor
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

    useEffect(() => {
        setPending(true)
    }, [src])

    return (
        <View style={{
            position: 'relative',
            width,
            height,
            backgroundColor
        }}>
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
            paddingVertical: 5,
            paddingHorizontal: 8,
            backgroundColor: '#5517e3',
            borderRadius: 15,
            alignSelf: 'flex-start'
        }}>
            <Text style={{
                color: '#fff',
                fontSize: 12
            }}>{children}</Text>
        </View>
    )
}


interface RatingScoreProps {
    score: number;
}

function RatingScore({ score }: RatingScoreProps) {

    const { textColor } = useTheme()
    const rate = score / 5;

    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <View style={{
                width: 30,
                height: 5,
                backgroundColor: '#999'
            }}>
                <View style={{
                    width: rate * 100 + '%',
                    height: '100%',
                    backgroundColor: `hsl(${rate * 120}, 75%, 50%)`
                }} />
            </View>
            <View style={{
                marginLeft: 5
            }}>
                <Text style={{
                    color: textColor
                }}>{score}</Text>
            </View>
        </View>
    )
}

export default Search;
