import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import LoadingScreen from '../screens/LoadingScreen';
import { useAuth } from '../context/AuthContext';
import JoinListScreen from '../screens/App/joinList'; // Ekranı import ettik

const Stack = createStackNavigator();

function RootNavigator() {
    const { isAuthenticated, authLoading } = useAuth();

    if (authLoading) {
        return <LoadingScreen />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                <Stack.Screen name="App" component={AppStack} />
            ) : (
                <Stack.Screen name="Auth" component={AuthStack} />
            )}
            <Stack.Screen name="JoinList" component={JoinListScreen} />
        </Stack.Navigator>
    );
}

export default RootNavigator;