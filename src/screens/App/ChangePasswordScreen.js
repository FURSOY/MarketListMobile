// src/screens/App/ChangePasswordScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext'; // useAuth hook'unu kullanıyoruz
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import { createAuthStyles } from '../../styles/AuthStyles';

function ChangePasswordScreen({ navigation }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // API_BASE_URL ve userToken kullanılarak istek atılacak
    const { userToken, API_BASE_URL } = useAuth();
    const { currentTheme } = useTheme();

    const styles = StyleSheet.create({
        ...createAuthStyles(currentTheme),
    });

    const handleChangePassword = async () => {
        setErrorMessage(null);

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setErrorMessage('Lütfen tüm alanları doldurun.');
            return;
        }
        if (newPassword.length < 4) { // Sunucu tarafındaki minimum 4 karakter kuralına uyduk
            setErrorMessage('Yeni şifreniz en az 4 karakter olmalıdır.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setErrorMessage('Yeni şifreler uyuşmuyor.');
            return;
        }
        if (currentPassword === newPassword) {
            setErrorMessage('Yeni şifre, mevcut şifrenizle aynı olamaz.');
            return;
        }

        setLoading(true);
        try {
            // API_BASE_URL ve userToken kullanılarak istek atılıyor
            const response = await axios.patch(`${API_BASE_URL}/user/update-password`,
                { currentPassword, newPassword, confirmNewPassword }, // confirmNewPassword'u da gönderelim, sunucu tarafta kontrol ediliyor
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`, // userToken kullanıldı
                    },
                }
            );

            if (response.data.status === 'success') {
                Alert.alert('Başarılı', response.data.message || 'Şifreniz başarıyla değiştirildi!');
                navigation.goBack();
            } else {
                setErrorMessage(response.data.message || 'Şifre değiştirme sırasında bir hata oluştu.');
            }
        } catch (error) {
            console.error('Şifre değiştirme hatası:', error.response?.data || error.message);
            setErrorMessage(error.response?.data?.message || 'Şifre değiştirilirken bilinmeyen bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Şifre Değiştir</Text>

            <TextInput
                style={styles.input}
                placeholder="Mevcut Şifre"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholderTextColor={currentTheme.colors.textSecondary}
            />
            <TextInput
                style={styles.input}
                placeholder="Yeni Şifre"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                placeholderTextColor={currentTheme.colors.textSecondary}
            />
            <TextInput
                style={styles.input}
                placeholder="Yeni Şifre Tekrar"
                secureTextEntry
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                placeholderTextColor={currentTheme.colors.textSecondary}
            />

            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

            <Button
                title={loading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
                onPress={handleChangePassword}
                disabled={loading}
                color={currentTheme.colors.primary}
            />
        </View>
    );

}

export default ChangePasswordScreen;