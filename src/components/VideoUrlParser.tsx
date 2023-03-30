import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Button, StyleProp, ViewStyle } from 'react-native';
import LoadingIndicator from './LoadingIndicator';
import { Video } from '../util/RegExp';

type M3u8UrlParserProps = {
    url: string;
    children: (url: string) => React.ReactElement;
    style?: StyleProp<ViewStyle>;
}

async function parseVideoUrl(url: string) {
    try {
        const html = await fetch(url).then(
            response => response.text()
        );
        const matchedUrls = html.match(Video.match);
        if (matchedUrls) {
            const parsedUrl = matchedUrls[0];
            if (parsedUrl.startsWith('http')) {
                return parsedUrl;
            }
            const uri = new URL(url);
            if (parsedUrl.startsWith('/')) {
                return uri.origin + parsedUrl;
            }
            const paths = uri.pathname.split('/');
            paths.pop();
            return uri.origin + paths.join('/') + '/' + parsedUrl;
        }
        else {
            throw new Error('😥 not matched.')
        }
    }
    catch (err) {
        console.log('💔 req failed')
        return null;
    }
}

function M3u8UrlParser({ url, children, style }: M3u8UrlParserProps) {

    const [m3u8Url, setM3u8Url] = useState<string | null>()
    const [error, setError] = useState(false)
    const isM3u8 = useMemo(() => Video.isVideoUrl(url), [url])

    const _parseUrl = async () => {
        const m3u8Url = await parseVideoUrl(url)
        if (m3u8Url) {
            if (m3u8Url.startsWith('http')) {
                setM3u8Url(m3u8Url)
            }
            else {
                const prefix = url.match(
                    /https?:\/\/[\da-zA-Z\-\.\_]+(:\d{2,5})?/
                )
                if (prefix) {
                    setM3u8Url(prefix[0] + m3u8Url)
                }
                else {
                    setError(true)
                }
            }
        }
        else {
            setError(true)
        }
    }

    useEffect(() => {
        if (!isM3u8) {
            setM3u8Url(null)
            _parseUrl()
        }
    }, [url])

    if (isM3u8) {
        return children(url)
    }
    return (
        <View style={
            [
                style,
                {
                    position: 'relative'
                }
            ]
        }>
            {
                m3u8Url && children(m3u8Url)
            }
            {
                m3u8Url === null && !error && (
                    <View style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#000'
                    }}>
                        <LoadingIndicator size={32} />
                        <View
                            style={{
                                marginLeft: 8
                            }}>
                            <Text style={{
                                fontSize: 13,
                                color: '#fff'
                            }}>地址解析中..</Text>
                        </View>
                    </View>
                )
            }
            {
                error && (
                    <View style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            paddingHorizontal: 25,
                            paddingVertical: 15,
                            width: '100%',
                            height: '100%'
                        }}>
                            <View style={{
                                marginBottom: 20
                            }}>
                                <Text style={{
                                    fontSize: 14,
                                    color: '#fff'
                                }}>地址解析失败</Text>
                            </View>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'flex-end'
                            }}>
                                <Button
                                    title="重试"
                                    color="#55a753"
                                    onPress={_parseUrl}
                                />
                            </View>
                        </View>
                    </View>
                )
            }
        </View>
    )
}

export default M3u8UrlParser;
