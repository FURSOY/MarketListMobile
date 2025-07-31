// src/screens/Auth/VerifyEmailScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import authApi from '../../api/auth';
import { createAuthStyles } from '../../styles/AuthStyles';

function VerifyEmailScreen({ route, navigation }) { // navigation'ı ekledim
    const { email: initialEmail } = route.params || {};
    const [email, setEmail] = useState(initialEmail || '');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false); // Yeni state
    const [errorMessage, setErrorMessage] = useState(null);
    const { signIn } = useAuth();
    const { currentTheme } = useTheme();

    const styles = createAuthStyles(currentTheme);

    const handleVerify = async () => {
        setErrorMessage(null);

        let emailError = false;
        let codeError = false;

        if (!email) {
            setErrorMessage('Lütfen e-posta adresinizi girin.');
            emailError = true;
        }
        if (!code) {
            setErrorMessage('Lütfen doğrulama kodunu girin.');
            codeError = true;
        } else if (code.length !== 6 || isNaN(code)) {
            setErrorMessage('Doğrulama kodu 6 haneli bir sayı olmalıdır.');
            codeError = true;
        }

        if (emailError || codeError) {
            return;
        }

        setLoading(true);
        try {
            const response = await authApi.verifyEmail(email, code);
            if (response.data.status === 'success') {
                const { token, user } = response.data;
                const result = await signIn(token, user);
                if (result.success) {
                    Alert.alert('Başarılı', 'Hesabınız başarıyla doğrulandı ve giriş yapıldı!');
                } else {
                    setErrorMessage(result.error);
                }
            } else {
                setErrorMessage(response.data.message || 'Doğrulama işlemi sırasında bir hata oluştu.');
            }
        } catch (error) {
            console.error('Doğrulama hatası:', error.response?.data || error.message);

            let clientDisplayErrorMessage = 'Doğrulama işlemi sırasında bir hata oluştu.';

            if (error.response && error.response.data && error.response.data.message) {
                clientDisplayErrorMessage = error.response.data.message;
            } else if (error.message === "Network Error") {
                clientDisplayErrorMessage = "Sunucuya bağlanılamadı. Lütfen internet bağlantınızı ve sunucu adresini kontrol edin.";
            } else {
                clientDisplayErrorMessage = error.message || 'Bilinmeyen bir hata oluştu.';
            }

            setErrorMessage(clientDisplayErrorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setErrorMessage(null);
        if (!email) {
            setErrorMessage('Lütfen kodu tekrar göndermek için e-posta adresinizi girin.');
            return;
        }

        setResendLoading(true); // Tekrar gönder loading'ini başlat
        try {
            const response = await authApi.sendVerificationCode(email);
            if (response.data.status === 'success') {
                Alert.alert('Başarılı', response.data.message || 'Yeni doğrulama kodu e-postanıza gönderildi!');
            } else {
                setErrorMessage(response.data.message || 'Kod tekrar gönderilirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Kod tekrar gönderme hatası:', error.response?.data || error.message);
            let clientDisplayErrorMessage = 'Kod tekrar gönderilirken bir hata oluştu.';
            if (error.response && error.response.data && error.response.data.message) {
                clientDisplayErrorMessage = error.response.data.message;
            } else if (error.message === "Network Error") {
                clientDisplayErrorMessage = "Sunucuya bağlanılamadı. Lütfen internet bağlantınızı ve sunucu adresini kontrol edin.";
            } else {
                clientDisplayErrorMessage = error.message || 'Bilinmeyen bir hata oluştu.';
            }
            setErrorMessage(clientDisplayErrorMessage);
        } finally {
            setResendLoading(false); // Tekrar gönder loading'ini bitir
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>E-posta Doğrulama</Text>
            <Text style={styles.infoText}>E-postanıza gönderilen 6 haneli kodu girin.</Text>
            <TextInput
                style={[
                    styles.input,
                    errorMessage && (errorMessage.includes('e-posta') || errorMessage.includes('email'))
                        ? { borderColor: currentTheme.colors.error }
                        : { borderColor: currentTheme.colors.border }
                ]}
                placeholder="E-posta"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!initialEmail}
                placeholderTextColor={currentTheme.colors.textSecondary}
            />
            <TextInput
                style={[
                    styles.input,
                    errorMessage && (errorMessage.includes('kodu') || errorMessage.includes('code'))
                        ? { borderColor: currentTheme.colors.error }
                        : { borderColor: currentTheme.colors.border }
                ]}
                placeholder="Doğrulama Kodu"
                keyboardType="numeric"
                maxLength={6}
                value={code}
                onChangeText={setCode}
                placeholderTextColor={currentTheme.colors.textSecondary}
            />
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            <Button title={loading ? "Doğrulanıyor..." : "Doğrula"} onPress={handleVerify} disabled={loading || resendLoading} color={currentTheme.colors.primary} />

            <TouchableOpacity
                onPress={handleResendCode}
                disabled={resendLoading || loading}
                style={[styles.Button, { backgroundColor: currentTheme.colors.secondary }]} // İkinci buton rengi farklı olsun
            >
                <Text style={styles.ButtonText}>
                    {resendLoading ? "Kod Gönderiliyor..." : "Kodu Tekrar Gönder"}
                </Text>
            </TouchableOpacity>

        </View>
    );
}

export default VerifyEmailScreen;