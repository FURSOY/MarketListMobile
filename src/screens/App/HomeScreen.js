import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import marketListApi from '../../api/marketList';
import { createMarketListStyles } from '../../styles/MarketListStyles';

function HomeScreen({ navigation }) {
    const { currentTheme } = useTheme();
    const styles = createMarketListStyles(currentTheme);

    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        loadLists();
    }, [loadLists]);

    const renderItem = ({ item }) => {
        return (
            <View style={styles.listItem}>
                <Text style={styles.listItemText}>{item.name}</Text>
            </View>
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
                />
            )}
        </View>
    );
}

export default HomeScreen;