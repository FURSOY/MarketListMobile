import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import RootNavigator from './navigation/RootNavigator';
import * as Linking from 'expo-linking'; // <-- Burayı EKLE!
import { Text } from 'react-native'; // Fallback component'i için (isteğe bağlı)

export default function App() {
  const prefix = Linking.createURL('/');

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        JoinList: 'joinList/:code', // Doğrudan RootNavigator içindeki ekran

        App: {
          screens: {
            Home: {
              screens: {
                HomeMain: 'home',
                MarketListDetail: 'lists/:listId',
              },
            },
            Profile: {
              screens: {
                ProfileMain: 'profile',
                // Diğerleri de eklenebilir ama şu an şart değil
              },
            },
          },
        },
      },
    },
    async getInitialURL() {
      const url = await Linking.getInitialURL();
      return url;
    },
    subscribe(listener) {
      const onReceiveURL = ({ url }) => listener(url);
      const subscription = Linking.addEventListener('url', onReceiveURL);
      return () => subscription.remove();
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