// src/screens/App/ThemeScreen.js
import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
// BURADAN import etmeniz gerekiyor:
import { lightTheme, darkTheme } from '../../config/theme'; // <-- BU SATIRI EKLEYİN

function ThemeScreen({ navigation }) {
    const { currentTheme, themeMode, toggleTheme, setAppTheme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: currentTheme.colors.background,
            padding: currentTheme.spacing.md,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: currentTheme.spacing.lg,
            paddingTop: currentTheme.spacing.md,
        },
        backButton: {
            padding: currentTheme.spacing.sm,
            marginRight: currentTheme.spacing.sm,
        },
        headerTitle: {
            fontSize: currentTheme.fontSizes.extraLarge,
            fontWeight: currentTheme.fontWeights.bold,
            color: currentTheme.colors.text,
        },
        settingItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: currentTheme.spacing.md,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: currentTheme.colors.border,
        },
        settingText: {
            fontSize: currentTheme.fontSizes.medium,
            color: currentTheme.colors.text,
        },
        themeOptionButton: {
            paddingVertical: currentTheme.spacing.md,
            paddingHorizontal: currentTheme.spacing.sm,
            borderRadius: currentTheme.borderRadius.md,
            borderWidth: 1,
            borderColor: currentTheme.colors.border,
            marginBottom: currentTheme.spacing.sm,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        selectedThemeOptionButton: {
            borderColor: currentTheme.colors.primary,
            borderWidth: 2,
        },
        themeOptionText: {
            fontSize: currentTheme.fontSizes.medium,
            color: currentTheme.colors.text,
        },
        colorBox: {
            width: 24,
            height: 24,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: currentTheme.colors.border,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image
                        source={require('../../assets/icons/back.png')}
                        style={{ width: 24, height: 24, marginRight: 16 }}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Theme Settings</Text>
            </View>

            <View style={{ marginTop: currentTheme.spacing.md }}>
                <Text style={[styles.settingText, { marginBottom: currentTheme.spacing.sm }]}>Temayı Seç</Text>

                <TouchableOpacity
                    style={[
                        styles.themeOptionButton,
                        themeMode === 'light' && styles.selectedThemeOptionButton,
                    ]}
                    onPress={() => setAppTheme('light')}
                >
                    <Text style={styles.themeOptionText}>Açık Tema</Text>
                    <View style={[styles.colorBox, { backgroundColor: lightTheme.colors.primary }]} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.themeOptionButton,
                        themeMode === 'dark' && styles.selectedThemeOptionButton,
                    ]}
                    onPress={() => setAppTheme('dark')}
                >
                    <Text style={styles.themeOptionText}>Koyu Tema</Text>
                    <View style={[styles.colorBox, { backgroundColor: darkTheme.colors.primary }]} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default ThemeScreen;