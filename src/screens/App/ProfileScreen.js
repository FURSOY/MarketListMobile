// reservationApp/Mobile/src/screens/App/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button, Alert, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; // useTheme hook'unu import et
import AntDesign from '@expo/vector-icons/AntDesign';

function ProfileScreen({ navigation }) {
    const { userData, signOut } = useAuth();
    const { currentTheme, themeMode, toggleTheme } = useTheme(); // Temayı ve değiştirme fonksiyonunu al

    // Stilleri dinamik olarak oluştur
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            paddingTop: 70,
            backgroundColor: currentTheme.colors.background,
        },
        Avatar: {
            width: 100,
            height: 100,
            borderRadius: 100
        },
        infoTextUser: {
            fontSize: currentTheme.fontSizes.medium,
            color: currentTheme.colors.textPrimary,
            textAlign: 'center',
            fontWeight: currentTheme.fontWeights.bold
        },
        infoTextEmail: {
            fontSize: currentTheme.fontSizes.small,
            color: currentTheme.colors.textPrimary,
            textAlign: 'center',
            fontWeight: currentTheme.fontWeights.regular
        },
        infoText: {
            fontSize: currentTheme.fontSizes.medium,
            marginBottom: currentTheme.spacing.sm,
            color: currentTheme.colors.textPrimary,
        },
        buttonSpacer: {
            height: currentTheme.spacing.md,
        },
        verifyLogo: {
            position: "absolute",
            bottom: 1,
            right: 1
        },
        button: {
            width: '100%',
            padding: currentTheme.spacing.ld,
            flexDirection: 'row',
            alignItems: 'center'
        },
        buttonText: {
            color: currentTheme.colors.textPrimary,
            fontSize: currentTheme.fontSizes.ml,
            fontWeight: currentTheme.fontWeights.semiBold
        }
    });

    const handleLogout = async () => {
        Alert.alert(
            "Çıkış Yap",
            "Hesabınızdan çıkış yapmak istediğinizden emin misiniz?",
            [
                {
                    text: "İptal",
                    style: "cancel"
                },
                {
                    text: "Evet",
                    onPress: async () => {
                        const result = await signOut();
                        if (result.success) {
                            // Çıkış başarılı
                        } else {
                            Alert.alert('Çıkış Hatası', result.error);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {userData && (
                <>
                    <View style={{}}>
                        <Image style={styles.Avatar} source={{ uri: userData.avatar }}></Image>
                        <Text style={styles.verifyLogo}>{userData.isVerified ? <Image
                            source={require('../../assets/icons/checked.png')}
                            style={{ width: 24, height: 24, marginRight: 16 }}
                        /> : ''}</Text>
                    </View>
                    <Text style={styles.infoTextUser}>{userData.name}</Text>
                    <Text style={styles.infoTextEmail}>{userData.email}</Text>
                </>
            )
            }


            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ThemeSettings')}>
                <Image
                    source={require('../../assets/icons/theme1.png')}
                    style={{ width: 24, height: 24, marginRight: 16 }}
                />
                <Text style={styles.buttonText}>Theme</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} >
                <Image
                    source={require('../../assets/icons/settings.png')}
                    style={{ width: 24, height: 24, marginRight: 16 }}
                />
                <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditProfile')}>
                <Image
                    source={require('../../assets/icons/edit.png')}
                    style={{ width: 24, height: 24, marginRight: 16 }}
                />
                <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            {
                userData && userData.isVerified ? (
                    <TouchableOpacity style={styles.button} onPress={handleLogout}>
                        <Image
                            source={require('../../assets/icons/logout.png')}
                            style={{ width: 24, height: 24, marginRight: 16 }}
                        />
                        <Text style={styles.buttonText}>Log out</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleLogout}>
                        <Image
                            source={require('../../assets/icons/checked.png')}
                            style={{ width: 24, height: 24, marginRight: 16 }}
                        />
                        <Text style={styles.buttonText}>Verify Email</Text>
                    </TouchableOpacity>
                )
            }

            {/* <Button
                title={`Temayı ${themeMode === 'light' ? 'Karanlık' : 'Aydınlık'} Yap`}
                onPress={toggleTheme}
                color={currentTheme.colors.accent} // Tema değiştirme butonu için farklı bir renk
            /> */}
        </View >
    );
}

export default ProfileScreen;