// src/screens/App/HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import CreateListModal from '../../components/CreateListModal';
import * as Linking from 'expo-linking'; // <-- Burayı ekleyin

function HomeScreen({ navigation }) {
    const { userToken, API_BASE_URL, isAuthenticated } = useAuth(); // isAuthenticated'ı da alın
    const { currentTheme } = useTheme();

    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLists = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/lists`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            if (response.data.status === 'success') {
                setLists(response.data.lists);
            } else {
                setError(response.data.message || 'Failed to fetch lists.');
            }
        } catch (err) {
            console.error('Error fetching lists:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Error fetching lists. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userToken, API_BASE_URL]);

    useEffect(() => {
        fetchLists();
    }, [fetchLists]);

    // Set up header button for creating a new list
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 15 }}
                    onPress={() => setIsCreateModalVisible(true)}
                >
                    <Ionicons name="add-circle-outline" size={30} color={currentTheme.colors.primary} />
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: currentTheme.colors.background,
            },
            headerTintColor: currentTheme.colors.text,
            headerTitleStyle: {
                color: currentTheme.colors.text,
            }
        });
    }, [navigation, currentTheme, setIsCreateModalVisible]);

    const handleListCreated = () => {
        setIsCreateModalVisible(false);
        fetchLists();
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchLists();
    };

    // --- YENİ DEEP LINKING MANTIK BURADA BAŞLIYOR ---
    const handleDeepLink = useCallback(async (event) => {
        const url = event?.url;
        if (url) {
            const parsedUrl = Linking.parse(url);
            // URL'de bir 'code' parametresi olup olmadığını kontrol et
            if (parsedUrl.queryParams && parsedUrl.queryParams.code) {
                const inviteCode = parsedUrl.queryParams.code;
                console.log('Deep link ile gelen davet kodu:', inviteCode);

                // Kullanıcı kimliği doğrulanmışsa listeye katılmayı dene
                if (isAuthenticated && userToken) {
                    try {
                        Alert.alert(
                            "Listeye Katıl?",
                            `Bir listeye davet edildiniz. Katılmak ister misiniz?`,
                            [
                                { text: "İptal", style: "cancel" },
                                {
                                    text: "Katıl",
                                    onPress: async () => {
                                        const response = await axios.post(
                                            `${API_BASE_URL}/lists/join/${inviteCode}`,
                                            {}, // Boş body
                                            {
                                                headers: {
                                                    Authorization: `Bearer ${userToken}`,
                                                },
                                            }
                                        );
                                        if (response.data.status === 'success') {
                                            Alert.alert('Başarılı', `Listeye başarıyla katıldınız: ${response.data.listName}`);
                                            // Katıldıktan sonra direkt o listeye yönlendirme (isteğe bağlı)
                                            navigation.navigate('MarketListDetail', { listId: response.data.listId, listName: response.data.listName });
                                            fetchLists(); // Kullanıcının listelerini yenile
                                        } else {
                                            Alert.alert('Hata', response.data.message || 'Listeye katılma başarısız.');
                                        }
                                    }
                                }
                            ]
                        );
                    } catch (err) {
                        console.error('Deep link ile listeye katılırken hata:', err.response?.data || err.message);
                        Alert.alert('Hata', err.response?.data?.message || 'Davet koduyla listeye katılırken bir hata oluştu.');
                    }
                } else {
                    // Kullanıcı giriş yapmamışsa, giriş yapmaya yönlendir
                    Alert.alert(
                        'Giriş Yapmalısın',
                        'Listeye katılmak için lütfen giriş yapın veya kaydolun.',
                        [{ text: 'Tamam', onPress: () => navigation.navigate('Auth') }] // 'Auth' AuthStack'inizin rotası olmalı
                    );
                }
            }
        }
    }, [isAuthenticated, userToken, API_BASE_URL, navigation, fetchLists]);

    // Uygulama deep link ile başlatıldığında initial URL'i kontrol et
    useEffect(() => {
        Linking.getInitialURL().then((url) => {
            if (url) {
                handleDeepLink({ url });
            }
        });
    }, [handleDeepLink]);

    // Uygulama zaten açıksa ve bir deep link ile çağrılırsa dinle
    useEffect(() => {
        const subscription = Linking.addEventListener('url', handleDeepLink);
        return () => subscription.remove(); // Unmount edildiğinde dinleyiciyi kaldır
    }, [handleDeepLink]);
    // --- YENİ DEEP LINKING MANTIK BURADA BİTİYOR ---


    const renderListItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.listItem,
                {
                    backgroundColor: currentTheme.colors.cardBackground,
                    borderBottomColor: currentTheme.colors.border,
                },
            ]}
            onPress={() => navigation.navigate('MarketListDetail', { listId: item.id, listName: item.name })}
        >
            <Text style={[styles.listName, { color: currentTheme.colors.text }]}>
                {item.name}
            </Text>
            <Ionicons
                name="chevron-forward-outline"
                size={24}
                color={currentTheme.colors.textSecondary}
            />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: currentTheme.colors.background }]}>
                <ActivityIndicator size="large" color={currentTheme.colors.primary} />
                <Text style={{ color: currentTheme.colors.textSecondary, marginTop: 10 }}>Loading lists...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.centered, { backgroundColor: currentTheme.colors.background }]}>
                <Text style={{ color: currentTheme.colors.error, textAlign: 'center' }}>{error}</Text>
                <TouchableOpacity onPress={fetchLists} style={styles.retryButton}>
                    <Text style={{ color: currentTheme.colors.buttonText }}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
            {lists.length === 0 ? (
                <View style={styles.emptyListContainer}>
                    <Ionicons name="sad-outline" size={60} color={currentTheme.colors.textSecondary} />
                    <Text style={[styles.emptyListText, { color: currentTheme.colors.text }]}>
                        You don't own any lists yet.
                    </Text>
                    <TouchableOpacity
                        style={[styles.createButton, { backgroundColor: currentTheme.colors.primary }]}
                        onPress={() => setIsCreateModalVisible(true)}
                    >
                        <Text style={[styles.createButtonText, { color: currentTheme.colors.buttonText }]}>
                            Create a New List
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={lists}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderListItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={currentTheme.colors.primary}
                            colors={[currentTheme.colors.primary]}
                            progressBackgroundColor={currentTheme.colors.cardBackground}
                        />
                    }
                />
            )}

            <CreateListModal
                isVisible={isCreateModalVisible}
                onClose={() => setIsCreateModalVisible(false)}
                onListCreated={handleListCreated}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingVertical: 10,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 8,
        borderBottomWidth: 1,
        elevation: 2, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    listName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyListText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    createButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    retryButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#007AFF', // A standard blue for retry
    }
});

export default HomeScreen;