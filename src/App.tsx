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
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from './hook/theme';

import VideoList from './pages/VideoList';
import TvList from './pages/TvList';
import Video from './pages/Video';
import Tv from './pages/Tv';

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
  const insets = useSafeAreaInsets();
  const { headerColor, textColor, statusBarColor } = useTheme();

  const commonOptions = {
    headerStyle: {
      backgroundColor: headerColor
    },
    headerTitleStyle: {
      color: textColor
    },
    contentStyle: {
      paddingBottom: insets.bottom
    },
    statusBarColor,
    statusBarTranslucent: true
    // headerBackImageSource: backImageAsset
  }
  return commonOptions;
}

function VideoListTab() {
  const options = useStackOptions()
  return (
    <Stack.Navigator screenOptions={options} initialRouteName="video_list">
      <Stack.Screen name="video_list" component={VideoList} options={{ // navigationBar
        title: '视频文件夹',
      }} />
      <Stack.Screen name="video_player" component={Video} />
    </Stack.Navigator>
  )
}

function TvListTab() {
  const options = useStackOptions()
  return (
    <Stack.Navigator screenOptions={options} initialRouteName="tv_list">
      <Stack.Screen name="tv_list" component={TvList} options={{ // navigationBar
        title: '电视直播',
      }} />
      <Stack.Screen name="live_player" component={Tv} />
    </Stack.Navigator>
  )
}

const assets = {
  video: require('./assets/video.png'),
  video_active: require('./assets/video_active.png'),
  tv: require('./assets/tv.png'),
  tv_active: require('./assets/tv_active.png'),
} as Record<string, any>

function Navigation() {
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
        })
      }>
        <Tab.Screen name="video" component={VideoListTab} options={{ tabBarLabel: '影视剧', headerShown: false }} />
        <Tab.Screen name="tv" component={TvListTab} options={{ tabBarLabel: '电视直播', headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default App;
