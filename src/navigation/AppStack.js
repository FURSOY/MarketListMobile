// reservationApp/Mobile/src/navigation/AppStack.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/App/HomeScreen';
import ProfileScreen from '../screens/App/ProfileScreen';
import EditProfileScreen from '../screens/App/EditProfileScreen';
import ChangePasswordScreen from '../screens/App/ChangePasswordScreen';
import ThemeScreen from '../screens/App/ThemeScreen';
import MarketListDetailScreen from '../screens/App/MarketListDetailScreen'; // Import new screen

const Tab = createBottomTabNavigator();
const ProfileInnerStack = createStackNavigator();
const HomeInnerStack = createStackNavigator(); // New stack for Home and its details

// Stack for Home and MarketListDetail
function HomeStack() {
    return (
        <HomeInnerStack.Navigator screenOptions={{ headerShown: true }}>
            <HomeInnerStack.Screen name="HomeMain" options={{ title: "Lists" }} component={HomeScreen} />
            <HomeInnerStack.Screen name="MarketListDetail" component={MarketListDetailScreen} />
        </HomeInnerStack.Navigator>
    );
}

function ProfileStack() {
    const { currentTheme } = useTheme();

    return (
        <ProfileInnerStack.Navigator
            screenOptions={{
                headerShown: true,
            }}
        >
            <ProfileInnerStack.Screen name="ProfileMain" options={{ title: "Profile" }} component={ProfileScreen} />
            <ProfileInnerStack.Screen name="EditProfile" component={EditProfileScreen} />
            <ProfileInnerStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <ProfileInnerStack.Screen name="ThemeSettings" component={ThemeScreen} />
        </ProfileInnerStack.Navigator>
    );
}

function AppStack() {
    const { currentTheme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') { // Changed from 'Ana Sayfa' to 'Home'
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Profile') { // Changed from 'Profil' to 'Profile'
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: currentTheme.colors.primary,
                tabBarInactiveTintColor: currentTheme.colors.textSecondary,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: currentTheme.colors.background,
                    borderTopColor: currentTheme.colors.border,
                },
                tabBarLabelStyle: {
                    fontSize: currentTheme.fontSizes.small,
                    fontWeight: currentTheme.fontWeights.medium,
                }
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
}

export default AppStack;