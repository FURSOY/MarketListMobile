// App.jsimport 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import RootNavigator from './navigation/RootNavigator';
import * as Linking from 'expo-linking'; // <-- Burayı EKLE!
import { Text } from 'react-native'; // Fallback component'i için (isteğe bağlı)

export default function App() {
  // Deep linking konfigürasyonu
  // app.json'daki 'scheme' değeriyle aynı olmalı: marketlistapp://
  const prefix = Linking.createURL('/');

  // Navigasyon rotalarınızın yapısına göre bu config'i dikkatlice ayarlayın.
  // RootNavigator içinde AuthStack ve AppStack var.
  // Deep link ile gidilecek ekranlar AppStack içinde olduğu için App rotasını hedefliyoruz.
  const linking = {
    prefixes: [prefix /*, 'https://yourdomain.com'*/], // Kendi domaininiz varsa ikinci kısmı ekleyin
    config: {
      screens: {
        // AppStack içindeki ekranlara derin linkle ulaşmak için 'App' rotasını hedefliyoruz.
        // AppStack'in içinde 'HomeTab' (BottomTabNavigator) ve onun içinde 'MarketListDetail'
        // ve 'joinList' rotalarınız olmalı.
        App: {
          screens: {
            // Eğer AppStack içinde doğrudan ekranlar varsa:
            // SomeScreen: 'someScreen',

            // Eğer AppStack içinde bir BottomTabNavigator (örneğin 'HomeTab') varsa:
            HomeTab: { // Bu, sizin BottomTabNavigator'ınızın adı olmalı
              screens: {
                HomeMain: 'home', // Home tab'ın ana ekranı (örneğin Home Screen)
                MarketListDetail: 'lists/:listId', // Bir listeye doğrudan gitmek için
                joinList: 'joinList/:code', // Davet koduyla listeye katılma rotası
              },
            },
            // AuthStack'inizdeki login veya register ekranlarına da deep link tanımlayabilirsiniz.
            // Ama genellikle davet linki zaten kullanıcıyı uygulamanın içine alır.
            // Eğer AuthStack'teyseniz ve bir deep link gelirseniz, handleDeepLink fonksiyonunuz bunu AuthStack dışına yönlendirmelidir.
          },
        },
        // Eğer kimlik doğrulama öncesi bir deep link gelirse (örn: şifre sıfırlama)
        // AuthStack içindeki ilgili rotayı buraya ekleyebilirsiniz:
        // Auth: {
        //   screens: {
        //     ResetPassword: 'reset-password/:token',
        //   },
        // },
      },
    },
    async getInitialURL() {
      const url = await Linking.getInitialURL();
      return url;
    },
    // Uygulama açıkken gelen URL'leri dinler
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