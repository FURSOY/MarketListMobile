import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import authApi from '../../api/auth';
import { createAuthStyles } from '../../styles/AuthStyles'; // Ortak stilleri import et

function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const { signIn } = useAuth();
    const { currentTheme } = useTheme();

    // Ortak stil fonksiyonunu çağırarak stilleri al
    const styles = createAuthStyles(currentTheme);

    const handleLogin = async () => {
        setErrorMessage(null);

        let emailError = false;
        let passwordError = false;

        if (!email) {
            setErrorMessage('Lütfen e-posta adresinizi girin.');
            emailError = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrorMessage('Lütfen geçerli bir e-posta adresi girin.');
            emailError = true;
        }
        if (!password) {
            setErrorMessage('Lütfen şifrenizi girin.');
            passwordError = true;
        }

        if (emailError || passwordError) {
            return;
        }

        setLoading(true);
        try {
            const response = await authApi.login(email, password);
            if (response.data.status === 'success') {
                const { token, user } = response.data;
                const result = await signIn(token, user);
                if (!result.success) {
                    setErrorMessage(result.error);
                }
            } else {
                setErrorMessage(response.data.message || 'Giriş işlemi sırasında bir hata oluştu.');
            }
        } catch (error) {
            console.error('Giriş hatası:', error.response?.data || error.message);

            let clientDisplayErrorMessage = 'Giriş işlemi sırasında bir hata oluştu.';

            if (error.response && error.response.data && error.response.data.message) {
                clientDisplayErrorMessage = error.response.data.message;
            } else if (error.message === "Network Error") {
                clientDisplayErrorMessage = "Sunucuya bağlanılamadı. Lütfen internet bağlantınızı ve sunucu adresini kontrol edin.";
            } else {
                clientDisplayErrorMessage = error.message || 'Bilinmeyen bir hata oluştu.';
            }

            if (clientDisplayErrorMessage === 'Lütfen giriş yapmadan önce e-posta adresinizi doğrulayın.') {
                Alert.alert('Doğrulama Gerekli', clientDisplayErrorMessage, [
                    { text: 'Tamam', onPress: () => navigation.navigate('VerifyEmail', { email }) }
                ]);
                setErrorMessage(null);
            } else {
                setErrorMessage(clientDisplayErrorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Giriş Yap</Text>
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
                placeholderTextColor={currentTheme.colors.textSecondary}
            />
            <TextInput
                style={[
                    styles.input,
                    errorMessage && (errorMessage.includes('şifre') || errorMessage.includes('password'))
                        ? { borderColor: currentTheme.colors.error }
                        : { borderColor: currentTheme.colors.border }
                ]}
                placeholder="Şifre"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor={currentTheme.colors.textSecondary}
            />

            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

            <TouchableOpacity
                style={styles.Button}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.ButtonText}>{loading ? "Giriş Yapılıyor..." : "Giriş Yap"}</Text>
            </TouchableOpacity>
            <View style={styles.spacer} />
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate('Signup')}
                disabled={loading}
            >
                <Text style={styles.navButtonText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

export default LoginScreen;