import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authApi from '../api/auth';
import { API_BASE_URL } from '../config/constants'; // ServerIp yerine API_BASE_URL kullanıyoruz

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    // Uygulama açıldığında veya yenilendiğinde token'ı kontrol et
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('user_token');
                if (token) {
                    // Token varsa, geçerliliğini API'den kontrol et
                    const response = await authApi.checkUser(); // /user/me endpoint'ine istek at
                    if (response.data.status === 'success') {
                        const newUserData = response.data.user;
                        await AsyncStorage.setItem('user_data', JSON.stringify(newUserData));
                        setUserToken(token);
                        setUserData(newUserData);
                        setIsAuthenticated(true);
                    } else {
                        // Token geçersizse veya API hata dönerse çıkış yap
                        console.warn('Token geçerliliğini yitirmiş veya sunucu hatası:', response.data.message);
                        await signOut(); // logout fonksiyonunu çağırmak yerine daha açıklayıcı bir isim
                    }
                }
            } catch (error) {
                console.error('AuthContext: Kullanıcı verileri yüklenirken hata oluştu:', error.response?.data || error.message);
                await signOut(); // Hata durumunda da çıkış yap
            } finally {
                setAuthLoading(false);
            }
        };

        loadUserData();
    }, []);

    const signIn = async (token, data) => {
        try {
            await AsyncStorage.setItem('user_token', token);
            await AsyncStorage.setItem('user_data', JSON.stringify(data));
            setUserToken(token);
            setUserData(data);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            console.error("AuthContext: Giriş yapılırken AsyncStorage hatası:", error);
            return { success: false, error: "Giriş hatası, lütfen tekrar deneyin." };
        }
    };

    const signOut = async () => {
        try {
            await AsyncStorage.removeItem('user_token');
            await AsyncStorage.removeItem('user_data');
            setUserToken(null);
            setUserData(null);
            setIsAuthenticated(false);
            return { success: true };
        } catch (error) {
            console.error("AuthContext: Çıkış yapılırken AsyncStorage hatası:", error);
            return { success: false, error: "Çıkış hatası, lütfen tekrar deneyin." };
        }
    };

    const updateProfileData = async (newData) => {
        try {
            await AsyncStorage.setItem('user_data', JSON.stringify(newData));
            setUserData(newData);
            return { success: true };
        } catch (error) {
            console.error("AuthContext: Profil verileri güncellenirken AsyncStorage hatası:", error);
            return { success: false, error: "Profil güncelleme hatası." };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                userToken,
                isAuthenticated,
                signIn,
                signOut,
                userData,
                updateProfileData,
                authLoading,
                API_BASE_URL, // API_BASE_URL'i de context üzerinden erişilebilir yapıyoruz
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);