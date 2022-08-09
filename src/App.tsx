import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from './hook/theme';

import Home from './pages/Home';
import Video from './pages/Video';

const Stack = createNativeStackNavigator();

const App = () => {
  const { statusBarColor, statusBarStyle } = useTheme();

  const backgroundStyle = {
    backgroundColor: statusBarColor,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={statusBarStyle} />
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

function Navigation() {

  const insets = useSafeAreaInsets();
  const { headerColor, textColor, statusBarColor, paperColor, isDark } = useTheme();

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
    // headerBackImageSource: backImageAsset
  }

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
      <Stack.Navigator screenOptions={commonOptions} initialRouteName="home">
        <Stack.Screen name="home" component={Home} options={{ // navigationBar
          title: '视频文件夹',
        }} />
        <Stack.Screen name="video" component={Video} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;
