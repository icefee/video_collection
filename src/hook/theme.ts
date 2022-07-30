import { useColorScheme } from 'react-native';
import { type StatusBarStyle } from 'react-native';

interface ThemeColor {
    backgroundColor: string;
    viewColor: string;
    paperColor: string;
    borderColor: string;
    textColor: string;
    headerColor: string;
    statusBarColor: string;
    statusBarStyle: StatusBarStyle;
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
            headerColor: '#666',
            statusBarColor: '#222',
            statusBarStyle: 'dark-content'
        }
    }
    else {
        return {
            backgroundColor: '#eee',
            viewColor: '#fff',
            paperColor: '#fff',
            borderColor: '#eee',
            textColor: '#000',
            headerColor: '#fff',
            statusBarColor: '#f3f3f3',
            statusBarStyle: 'light-content'
        }
    }
}
