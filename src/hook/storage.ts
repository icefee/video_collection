import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const getStoreData = async <T = object>(key: string) => {
    try {
        const json = await AsyncStorage.getItem(key)
        return json != null ? JSON.parse(json) as T : null;
    } catch (e) {
        console.warn('get store data error')
        return null;
    }
}

const setStoreData = async (key: string, value: object) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
        console.warn('set store data error')
    }
}

export function usePersistentStorage<T extends object>(key: string, initValue: T): [T, Dispatch<SetStateAction<T>>] {
    const [store, setStore] = useState<T>(initValue)
    const init = useRef(true)
    useEffect(() => {
        const _getStore = async () => {
            const store = await getStoreData<T>(key)
            if (store) {
                setStore(store)
            }
        }
        _getStore()
    }, [])
    useEffect(() => {
        if (init.current) {
            init.current = false
        }
        else {
            setStoreData(key, store)
        }
    }, [store])
    return [store, setStore]
}
