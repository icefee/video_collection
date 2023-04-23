import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { usePersistentStorage } from '../hook/storage';
import { formatDate } from '../util/date';
import { showToast } from '../util/toast';
import { apiUrl } from '../config';

const fetchApiSource = async () => {
    try {
        const { code, data, msg } = await fetch(`${apiUrl}/api/video/source`).then<ApiJsonType<ApiSource[]>>(
            response => response.json()
        )
        if (code === 0) {
            return data;
        }
        else {
            throw new Error(msg)
        }
    }
    catch (err) {
        return null;
    }
}

function ApiSource() {

    const [apiSource, setApiSource] = usePersistentStorage<{
        data: ApiSource[],
        update: number
    }>('__api_source', {
        data: [],
        update: 0
    })

    const [loading, setLoading] = useState(false)

    const updateApiSource = async () => {
        if (!loading) {
            setLoading(true)
            const apiSources = await fetchApiSource();
            if (apiSources) {
                setApiSource({
                    data: apiSources,
                    update: +new Date
                })
            }
            else {
                showToast('数据源获取失败')
            }
            setLoading(false)
        }
    }

    return (
        <View style={{
            height: '100%',
            padding: 20
        }}>
            <View style={{
                flexGrow: 1
            }}>
                {
                    apiSource.data.length > 0 ? (
                        <View>
                            <Text style={{
                                fontSize: 16
                            }}>当前数据源: {apiSource.data.length}个</Text>
                            <Text style={{
                                fontSize: 16
                            }}>更新于: {formatDate(apiSource.update)}</Text>
                        </View>
                    ) : (
                        <View>
                            <Text>暂无本地数据源</Text>
                        </View>
                    )
                }
            </View>
            <Button
                title={loading ? '更新中' : '更新'}
                color={loading ? '#9f76ff' : '#5517e3'}
                onPress={updateApiSource}
            />
        </View>
    )
}

ApiSource.fetchApiSource = fetchApiSource;

export default ApiSource;
