// src/screens/Auth/SignupScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import authApi from '../../api/auth';
import { createAuthStyles } from '../../styles/AuthStyles'; // Ortak stilleri import et

function SignupScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const { currentTheme } = useTheme();

    // Ortak stil fonksiyonunu çağırarak stilleri al
    const styles = createAuthStyles(currentTheme);

    const handleSignup = async () => {
        setErrorMessage(null);

        let nameError = false;
        let emailError = false;
        let passwordError = false;

        if (!name) {
            setErrorMessage('Lütfen adınızı girin.');
            nameError = true;
        }
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
        } else if (password.length < 4) {
            setErrorMessage('Şifreniz en az 6 karakter olmalıdır.');
            passwordError = true;
        }

        if (nameError || emailError || passwordError) {
            return;
        }

        setLoading(true);
        try {
            const response = await authApi.signup(name, email, password);
            if (response.data.status === 'success') {
                Alert.alert('Kayıt Başarılı', 'E-posta adresinize doğrulama kodu gönderildi. Lütfen hesabınızı etkinleştirin.');
                navigation.navigate('VerifyEmail', { email });
            } else {
                setErrorMessage(response.data.message || 'Kayıt işlemi sırasında bir hata oluştu.');
            }
        } catch (error) {
            console.error('Kayıt hatası:', error.response?.data || error.message);

            let clientDisplayErrorMessage = 'Kayıt işlemi sırasında bir hata oluştu.';

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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kayıt Ol</Text>
            <TextInput
                style={[
                    styles.input,
                    errorMessage && (errorMessage.includes('adınız') || errorMessage.includes('name'))
                        ? { borderColor: currentTheme.colors.error }
                        : { borderColor: currentTheme.colors.border }
                ]}
                placeholder="Adınız"
                value={name}
                onChangeText={setName}
                placeholderTextColor={currentTheme.colors.textSecondary}
            />
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
                onPress={handleSignup}
                disabled={loading}
            >
                <Text style={styles.ButtonText}>{loading ? "Kaydolunuyor..." : "Kayıt Ol"}</Text>
            </TouchableOpacity>
            <View style={styles.spacer} />
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.goBack()}
                disabled={loading}
            >
                <Text style={styles.navButtonText}>Go Back Login</Text>
            </TouchableOpacity>
        </View>
    );
}

export default SignupScreen;