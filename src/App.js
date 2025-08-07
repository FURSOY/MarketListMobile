// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import RootNavigator from './navigation/RootNavigator';
import * as Linking from 'expo-linking';
import { Text } from 'react-native';

export default function App() {
  const prefix = Linking.createURL('/');

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        // Doğrudan RootNavigator'daki Stack.Screen isimlerini kullanın
        App: 'App', // `RootNavigator` içindeki `App` Stack'i
        Auth: 'Auth', // `RootNavigator` içindeki `Auth` Stack'i
        JoinList: 'joinList/:code', // `RootNavigator` içindeki `JoinList` ekranı
      },
    },
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer linking={linking} fallback={<Text>Loading navigation...</Text>}>
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}