import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Image,
  ImageSourcePropType
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from './hook/theme';

import VideoList from './pages/VideoList';
import TvList from './pages/TvList';
import Video from './pages/Video';
import Tv from './pages/Tv';
import Search from './pages/Search';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App = () => {
  const { statusBarColor, statusBarStyle } = useTheme();

  const backgroundStyle = {
    backgroundColor: statusBarColor,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar translucent barStyle={statusBarStyle} />
      <View style={{
        height: '100%'
      }}>
        <SafeAreaProvider>
          <Navigation />
        </SafeAreaProvider>
      </View>
    </SafeAreaView>
  );
};

function useStackOptions() {
  const { headerColor, textColor, statusBarColor } = useTheme();

  const commonOptions = {
    headerStyle: {
      backgroundColor: headerColor
    },
    headerTitleStyle: {
      color: textColor
    },
    statusBarColor,
    statusBarTranslucent: true,
    // headerShown: false
    // headerBackImageSource: backImageAsset
  }
  return commonOptions;
}

function TabView() {
  return (
    <Tab.Navigator screenOptions={
      ({ route }) => ({
        tabBarIcon: ({ focused }) => {
          return (
            <View>
              <Image style={{
                resizeMode: 'center',
                width: 28,
                height: 28
              }} source={
                assets[route.name + (focused ? '_active' : '')] as ImageSourcePropType
              } />
            </View>
          )
        },
        tabBarActiveTintColor: '#5517e3',
        tabBarInactiveTintColor: 'gray',
        tabBarHideOnKeyboard: true
      })
    }>
      <Tab.Screen name="video" component={VideoList} options={{ headerTitle: '影视剧', tabBarLabel: '影视剧' }} />
      <Tab.Screen name="search" component={Search} options={{ headerTitle: '搜索', tabBarLabel: '搜索' }} />
      <Tab.Screen name="tv" component={TvList} options={{ headerTitle: '电视直播', tabBarLabel: '电视直播' }} />
    </Tab.Navigator>
  )
}

const assets = {
  video: require('./assets/video.png'),
  video_active: require('./assets/video_active.png'),
  tv: require('./assets/tv.png'),
  tv_active: require('./assets/tv_active.png'),
  search: require('./assets/search.png'),
  search_active: require('./assets/search_active.png')
} as Record<string, any>

function Navigation() {
  const options = useStackOptions()
  const { headerColor, textColor, paperColor, isDark } = useTheme();

  return (
    <NavigationContainer theme={{
      dark: isDark,
      colors: {
        primary: textColor,
        background: headerColor,
        card: paperColor,
        text: textColor,
        border: textColor,
        notification: headerColor
      }
    }}>
      <Stack.Navigator screenOptions={options} initialRouteName="home">
        <Stack.Screen name="home" component={TabView} options={{ headerShown: false }} />
        <Stack.Screen name="video_player" component={Video} />
        <Stack.Screen name="live_player" component={Tv} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;
