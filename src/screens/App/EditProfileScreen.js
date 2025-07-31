// src/screens/App/EditProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native';
import { useAuth } from '../../context/AuthContext'; // useAuth hook'unu kullanıyoruz
import { useTheme } from '../../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { createAuthStyles } from '../../styles/AuthStyles';

function EditProfileScreen({ navigation }) {
    // user yerine userData, ServerIp yerine API_BASE_URL
    // updateUserInfo yerine updateProfileData kullanıyoruz
    const { userData, API_BASE_URL, updateProfileData, userToken } = useAuth();
    const { currentTheme } = useTheme();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUri, setAvatarUri] = useState(null);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const styles = StyleSheet.create({
        ...createAuthStyles(currentTheme),
        container: {
            flexGrow: 1,
            padding: currentTheme.spacing.lg,
            backgroundColor: currentTheme.colors.background,
            alignItems: 'center',
        },
        avatarContainer: {
            width: 120,
            height: 120,
            backgroundColor: currentTheme.colors.secondaryBackground,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: currentTheme.spacing.lg,
            borderWidth: 2,
            borderColor: 0,
            overflow: 'hidden',
        },
        avatarImage: {
            width: '100%',
            height: '100%',
            borderRadius: 60,
        },
        avatarIcon: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: currentTheme.colors.primary,
            borderRadius: 15,
            padding: 5,
        },
        buttonSpacer: {
            height: currentTheme.spacing.md,
        },
        sectionTitle: {
            fontSize: currentTheme.fontSizes.large,
            fontWeight: currentTheme.fontWeights.bold,
            color: currentTheme.colors.textPrimary,
            marginTop: currentTheme.spacing.lg,
            marginBottom: currentTheme.spacing.md,
            width: '100%',
            textAlign: 'left',
        },
    });

    // userData değiştiğinde state'leri güncelle
    useEffect(() => {
        if (userData) {
            setName(userData.name || '');
            setEmail(userData.email || '');
            // Avatar için kontrol: Base64 mi yoksa URL mi?
            if (userData.avatar) {
                if (userData.avatar.startsWith('data:image/')) {
                    setAvatarUri(userData.avatar); // Base64 ise direkt kullan
                } else {
                    // Eğer sunucu sadece path döndürüyorsa, tam URL oluştur
                    // Sunucu kodunda defaultImageBase64 olarak Base64 döndürüldüğü için bu kısım muhtemelen çalışmaz
                    // Ama yine de defensive programming için bırakılabilir.
                    setAvatarUri(`${API_BASE_URL}${userData.avatar}`);
                }
            } else {
                setAvatarUri(null); // Avatar yoksa null yap (varsayılan ikon gösterilir)
            }
        }
    }, [userData, API_BASE_URL]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('İzin Gerekli', 'Avatar seçmek için galeri iznine ihtiyacımız var.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedUri = result.assets[0].uri;

            try {
                const manipResult = await ImageManipulator.manipulateAsync(
                    selectedUri,
                    [{ resize: { width: 400, height: 400 } }],
                    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
                );
                // Base64 URI'sini oluşturup state'e atıyoruz
                setAvatarUri(`data:image/jpeg;base64,${manipResult.base64}`);

            } catch (error) {
                console.error("Image manipulation failed", error);
                Alert.alert('Hata', 'Görsel düzenleme sırasında bir sorun oluştu.');
            }
        }
    };

    const handleUpdateProfile = async () => {
        setErrorMessage(null);

        if (!name.trim()) {
            setErrorMessage('Ad alanı boş bırakılamaz.');
            return;
        }
        if (!email.trim()) {
            setErrorMessage('E-posta alanı boş bırakılamaz.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrorMessage('Lütfen geçerli bir e-posta adresi girin.');
            return;
        }

        setLoading(true);
        try {
            const updateData = {
                name: name,
                email: email,
            };

            let finalAvatarToSend = undefined; // Undefined bırak ki değişmediyse payload'a eklenmesin

            // Eğer avatarUri state'i bir Base64 string ise ve userData.avatar'dan farklıysa (yani yeni seçilmişse)
            if (avatarUri && avatarUri.startsWith('data:image/') && avatarUri !== userData?.avatar) {
                finalAvatarToSend = avatarUri; // Doğrudan Base64 stringini gönder
            }
            // Eğer avatarUri null olduysa ve daha önce bir avatar varsa (kullanıcı silmek istemiştir)
            else if (avatarUri === null && userData?.avatar) {
                finalAvatarToSend = null; // Sunucuya null göndererek avatarı sıfırla
            }
            // Aksi takdirde (avatar değişmediyse veya başlangıçta null'sa ve yine null'sa), undefined kalır.

            if (finalAvatarToSend !== undefined) {
                updateData.avatar = finalAvatarToSend;
            }

            // API_BASE_URL ve userToken kullanılarak istek atılıyor
            const response = await axios.patch(`${API_BASE_URL}/user/update-me`, updateData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`, // userToken kullanıldı
                },
            });

            if (response.data.status === 'success') {
                Alert.alert('Başarılı', response.data.message || 'Profil başarıyla güncellendi!');
                navigation.navigate('ProfileMain')
                updateProfileData(response.data.user); // AuthContext'i güncel userData ile yenile
            } else {
                setErrorMessage(response.data.message || 'Profil güncelleme sırasında bir hata oluştu.');
            }
        } catch (error) {
            console.error('Profil güncelleme hatası:', error.response?.data || error.message);
            setErrorMessage(error.response?.data?.message || 'Profil güncellenirken bilinmeyen bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // Avatarın gösterileceği kaynağı belirleyen yardımcı fonksiyon
    const getDisplayAvatarSource = () => {
        if (avatarUri) {
            return { uri: avatarUri };
        }
        return null;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Profil Düzenle</Text>

            {/* Avatar Bölümü */}
            <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                {getDisplayAvatarSource() ? (
                    <Image source={getDisplayAvatarSource()} style={styles.avatarImage} />
                ) : (
                    <Ionicons name="person-circle-outline" size={100} color={currentTheme.colors.textSecondary} />
                )}
                <View style={styles.avatarIcon}>
                    <Ionicons name="camera" size={20} color={currentTheme.colors.textBackground} />
                </View>
            </TouchableOpacity>
            <Text style={styles.infoText}>Avatarı değiştirmek için dokunun</Text>

            {/* Genel Bilgiler */}
            <Text style={styles.sectionTitle}>Genel Bilgiler</Text>
            <TextInput
                style={styles.input}
                placeholder="Adınız"
                value={name}
                onChangeText={setName}
                placeholderTextColor={currentTheme.colors.textSecondary}
            />
            <TextInput
                style={styles.input}
                placeholder="E-posta"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor={currentTheme.colors.textSecondary}
            />

            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

            <Button
                title={loading ? "Kaydediliyor..." : "Profili Güncelle"}
                onPress={handleUpdateProfile}
                disabled={loading}
                color={currentTheme.colors.primary}
            />

            <View style={styles.buttonSpacer} />

            {/* Şifre Değiştirme */}
            <Text style={styles.sectionTitle}>Şifre</Text>
            <Button
                title="Şifre Değiştir"
                onPress={() => navigation.navigate('ChangePassword')}
                color={currentTheme.colors.secondary}
            />

            <View style={styles.buttonSpacer} />

        </ScrollView>
    );
}

export default EditProfileScreen;