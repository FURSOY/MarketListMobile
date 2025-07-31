// src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native'; // Cihazın sistem temasını algılamak için
import AsyncStorage from '@react-native-async-storage/async-storage'; // Temayı kalıcı olarak saklamak için

import { lightTheme, darkTheme } from '../config/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme(); // 'light' veya 'dark'
    const [currentTheme, setCurrentTheme] = useState(lightTheme);
    const [themeMode, setThemeMode] = useState('light'); // 'light' veya 'dark'

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const storedThemeMode = await AsyncStorage.getItem('userThemeMode');
                if (storedThemeMode) {
                    setThemeMode(storedThemeMode);
                    setCurrentTheme(storedThemeMode === 'dark' ? darkTheme : lightTheme);
                } else {
                    // Eğer kullanıcı daha önce bir seçim yapmadıysa, sistem temasını kullan
                    setThemeMode(systemColorScheme || 'light');
                    setCurrentTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
                }
            } catch (error) {
                console.error("Failed to load theme from AsyncStorage:", error);
                setThemeMode(systemColorScheme || 'light'); // Hata durumunda sistem temasını kullan
                setCurrentTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
            }
        };
        loadTheme();
    }, [systemColorScheme]); // systemColorScheme değiştiğinde de tema yüklensin

    const toggleTheme = async () => {
        const newMode = themeMode === 'light' ? 'dark' : 'light';
        setThemeMode(newMode);
        setCurrentTheme(newMode === 'dark' ? darkTheme : lightTheme);
        await AsyncStorage.setItem('userThemeMode', newMode); // Yeni temayı kaydet
    };

    const setAppTheme = async (mode) => {
        if (mode === 'light' || mode === 'dark') {
            setThemeMode(mode);
            setCurrentTheme(mode === 'dark' ? darkTheme : lightTheme);
            await AsyncStorage.setItem('userThemeMode', mode);
        }
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, themeMode, toggleTheme, setAppTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);