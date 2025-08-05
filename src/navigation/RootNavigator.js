import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import LoadingScreen from '../screens/LoadingScreen';
import { useAuth } from '../context/AuthContext';
import JoinListScreen from '../screens/App/joinList';

const Stack = createStackNavigator();

function RootNavigator() {
    const { isAuthenticated, authLoading } = useAuth();

    if (authLoading) {
        return <LoadingScreen />;
    }

    // Deep link ile gelen bir parametre varsa, JoinList ekranını en üste ekleyin
    // Ancak bu, App.js'teki linking konfigürasyonu tarafından otomatik olarak yönetilmelidir.
    // Bu yüzden burayı daha basit tutalım.

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                // Kullanıcı giriş yapmışsa ana uygulama ekranını göster
                <Stack.Screen name="App" component={AppStack} />
            ) : (
                // Kullanıcı giriş yapmamışsa kimlik doğrulama ekranlarını göster
                <Stack.Screen name="Auth" component={AuthStack} />
            )}
            {/* JoinList ekranını artık buraya koymuyoruz.
      Deep linking bu ekranı otomatik olarak NavigationContainer içinde bulacak. */}
        </Stack.Navigator>
    );
}

export default RootNavigator;