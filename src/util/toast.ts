import { ToastAndroid } from 'react-native';

export const showToast = (msg: string) => ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.BOTTOM)
