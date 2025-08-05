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

        Root: {
          path: '/',
          screens: {
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
                  },
                },
              },
            },
            Auth: {
              screens: {
                Login: 'login',
                Signup: 'signup',
              },
            },
            // Diğer RootNavigator rotalarını buraya ekleyebilirsiniz
          },
        },
        // Deep link ile tetiklenecek ekranı RootNavigator'ın dışında, ana seviyede tanımlayın
        JoinList: 'joinList/:code',
      },
    },
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        {/* NavigationContainer'a fallback ekranı eklemek iyi bir pratik */}
        <NavigationContainer linking={linking} fallback={<Text>Loading navigation...</Text>}>
          {/* JoinList ekranını RootNavigator'ın dışında tanımladığımız için
          burada RootNavigator'ı doğrudan çağırıyoruz */}
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}