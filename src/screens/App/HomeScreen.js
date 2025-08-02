import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import marketListApi from '../../api/marketList';
import { createMarketListStyles } from '../../styles/MarketListStyles';
import { Ionicons } from '@expo/vector-icons';
import CreateListModal from '../../components/CreateListModal';

function HomeScreen({ navigation }) {
    const { currentTheme } = useTheme();
    const styles = createMarketListStyles(currentTheme);

    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [createMenuShow, setCreateMenuShow] = useState(false);

    const loadLists = useCallback(async () => {
        setLoading(true);
        try {
            const response = await marketListApi.getUserLists();
            const data = response.data.lists || [];
            setLists(data);
        } catch (error) {
            console.error('Liste alınamadı:', error.message);
            setLists([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await loadLists();
        } catch (error) {
            console.error('Liste yenilenemedi:', error.message);
        } finally {
            setRefreshing(false);
        }
    }, [loadLists]);

    const toggleCreateMenu = useCallback(() => {
        setCreateMenuShow(prev => !prev);
    }, []);

    const handleModalClose = useCallback(() => {
        setCreateMenuShow(false);
        loadLists();
    }, [loadLists]);

    // YENİ: Listeye tıklandığında detay sayfasına gitme
    const handleListPress = (list) => {
        navigation.navigate('MarketListDetail', { listId: list.id, listName: list.name });
    };

    useEffect(() => {
        loadLists();
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 15 }}
                    onPress={toggleCreateMenu}
                >
                    <Ionicons
                        name="add-circle-outline"
                        size={30}
                        color={currentTheme.colors.primary}
                    />
                </TouchableOpacity>
            ),
        });
    }, [navigation, currentTheme, toggleCreateMenu, loadLists]);

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.listItem}
                onPress={() => handleListPress(item)} // YENİ: onPress olayı
            >
                <Text style={styles.listItemText}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color={currentTheme.colors.PrimaryText} />
            ) : lists.length === 0 ? (
                <Text style={styles.emptyText}>Liste bulunmamakta</Text>
            ) : (
                <FlatList
                    data={lists}
                    keyExtractor={(item, index) => (item && item.id) ? item.id.toString() : index.toString()}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[currentTheme.colors.textPrimary]}
                            tintColor={currentTheme.colors.textPrimary}
                        />
                    }
                />
            )}
            <CreateListModal
                visible={createMenuShow}
                onClose={handleModalClose}
                onListCreated={loadLists}
            />
        </View>
    );
}

export default HomeScreen;