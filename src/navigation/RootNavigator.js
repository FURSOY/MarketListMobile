// reservationApp/Mobile/src/navigation/RootNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import LoadingScreen from '../screens/LoadingScreen';
import { useAuth } from '../context/AuthContext';
import JoinListScreen from '../screens/App/joinList'; // path'e göre düzenle

const Stack = createStackNavigator();

function RootNavigator() {
    const { isAuthenticated, authLoading } = useAuth();

    if (authLoading) {
        return <LoadingScreen />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>

            <Stack.Screen name="JoinList" component={JoinListScreen} />

            {isAuthenticated ? (
                <Stack.Screen name="App" component={AppStack} />
            ) : (
                <Stack.Screen name="Auth" component={AuthStack} />
            )}
        </Stack.Navigator>
    );
}

export default RootNavigator;