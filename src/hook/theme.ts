import { useColorScheme } from 'react-native';
import { type StatusBarStyle, type ImageSourcePropType } from 'react-native';

interface ThemeColor {
    backgroundColor: string;
    viewColor: string;
    paperColor: string;
    borderColor: string;
    textColor: string;
    subTextColor: string;
    headerColor: string;
    statusBarColor: string;
    backdropColor: string;
    statusBarStyle: StatusBarStyle;
    backImageAsset: ImageSourcePropType;
    isDark: boolean;
}

export function useTheme(): ThemeColor {
    const theme = useColorScheme();
    if (theme === 'dark') {
        return {
            backgroundColor: '#000',
            viewColor: '#000',
            paperColor: '#222',
            borderColor: '#444',
            textColor: '#fff',
            subTextColor: '#aaa',
            headerColor: '#222',
            statusBarColor: '#222',
            backdropColor: 'rgba(0, 0, 0, .2)',
            statusBarStyle: 'dark-content',
            backImageAsset: require('../assets/back_light.png'),
            isDark: true
        }
    }
    else {
        return {
            backgroundColor: '#eee',
            viewColor: '#fff',
            paperColor: '#fff',
            borderColor: '#eee',
            textColor: '#000',
            subTextColor: '#666',
            headerColor: '#fff',
            statusBarColor: '#999',
            backdropColor: 'rgba(255, 255, 255, .2)',
            statusBarStyle: 'light-content',
            backImageAsset: require('../assets/back_dark.png'),
            isDark: false
        }
    }
}
