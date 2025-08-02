import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Switch,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import marketListApi from '../../api/marketList';
import { createMarketListStyles } from '../../styles/MarketListStyles';

function MarketListDetailScreen({ route, navigation }) {
    const { listId, listName } = route.params;
    const { currentTheme } = useTheme();
    const styles = createMarketListStyles(currentTheme);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('1');
    const [addingItem, setAddingItem] = useState(false);
    const [showPurchased, setShowPurchased] = useState(false);

    const loadListItems = useCallback(async () => {
        setLoading(true);
        try {
            const response = await marketListApi.getListDetails(listId);
            setItems(response.data.list.items || []);
        } catch (error) {
            console.error('Liste detayları alınamadı:', error);
            Alert.alert('Hata', 'Liste detayları yüklenemedi.');
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [listId]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadListItems();
        setRefreshing(false);
    }, [loadListItems]);

    const handleAddItem = async () => {
        if (!newItemName.trim()) {
            Alert.alert('Hata', 'Lütfen bir öğe adı girin.');
            return;
        }

        const quantity = parseInt(newItemQuantity, 10);
        if (isNaN(quantity) || quantity < 1) {
            Alert.alert('Hata', 'Miktar geçerli bir sayı olmalı ve en az 1 olmalıdır.');
            return;
        }

        setAddingItem(true);
        try {
            await marketListApi.addListItem(listId, newItemName, quantity);
            setNewItemName('');
            setNewItemQuantity('1');
            await loadListItems();
        } catch (error) {
            console.error('Öğe eklenirken hata:', error);
            Alert.alert('Hata', 'Öğe eklenirken bir sorun oluştu.');
        } finally {
            setAddingItem(false);
        }
    };

    const togglePurchaseStatus = async (item) => {
        try {
            if (item.isPurchased) {
                await marketListApi.markItemAsUnpurchased(listId, item.id);
            } else {
                await marketListApi.markItemAsPurchased(listId, item.id);
            }
            await loadListItems();
        } catch (error) {
            Alert.alert('Hata', 'Alışveriş durumu güncellenemedi.');
            console.error('Alışveriş durumu hatası:', error);
        }
    };

    useEffect(() => {
        loadListItems();
        navigation.setOptions({ title: listName });
    }, [listId, listName, loadListItems, navigation]);

    const renderItem = ({ item }) => {
        return (
            <View style={styles.listItem}>
                <View style={styles.itemInfo}>
                    <Text
                        style={[
                            styles.listItemText,
                            item.isPurchased && styles.purchasedText,
                        ]}
                    >
                        {item.name}
                    </Text>
                    <Text style={styles.itemQuantityText}>{item.quantity} adet</Text>
                </View>
                <Switch
                    value={item.isPurchased}
                    onValueChange={() => togglePurchaseStatus(item)}
                    thumbColor={
                        item.isPurchased
                            ? currentTheme.colors.primary
                            : currentTheme.colors.textSecondary
                    }
                    trackColor={{
                        false: currentTheme.colors.border,
                        true: currentTheme.colors.primaryLight,
                    }}
                />
            </View>
        );
    };

    const notPurchased = items
        .filter((item) => !item.isPurchased)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const purchased = items
        .filter((item) => item.isPurchased)
        .sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt));

    const renderPurchasedList = () => {
        if (purchased.length === 0) {
            return null;
        }

        const itemHeight = 60; // listItem stiline göre öğe yüksekliğini belirle
        const maxListHeight = itemHeight * 3; // 3 öğelik maksimum yükseklik

        return (
            <View>
                <TouchableOpacity
                    style={styles.purchasedHeader}
                    onPress={() => setShowPurchased(!showPurchased)}
                >
                    <Text style={styles.purchasedHeaderText}>
                        Satın Alınanlar ({purchased.length})
                    </Text>
                    <Ionicons
                        name={
                            showPurchased
                                ? 'chevron-down-outline'
                                : 'chevron-forward-outline'
                        }
                        size={24}
                        color={currentTheme.colors.textSecondary}
                    />
                </TouchableOpacity>
                {showPurchased && (
                    <FlatList
                        data={purchased}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        style={{ maxHeight: maxListHeight }} // Maksimum yüksekliği belirle
                        nestedScrollEnabled={true} // İç içe kaydırmayı etkinleştir
                    />
                )}
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={90}
        >
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={currentTheme.colors.textPrimary}
                />
            ) : (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={notPurchased}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={{ flexGrow: 1 }}
                        ListEmptyComponent={() => (
                            <Text style={styles.emptyText}>
                                Bu listede henüz alınmamış ürün yok.
                            </Text>
                        )}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[currentTheme.colors.textPrimary]}
                                tintColor={currentTheme.colors.textPrimary}
                            />
                        }
                    />
                    {renderPurchasedList()}
                </View>
            )}

            <View
                style={[
                    styles.addItemContainer,
                    { borderTopColor: currentTheme.colors.border },
                ]}
            >
                <TextInput
                    style={[
                        styles.input,
                        {
                            borderColor: currentTheme.colors.primary,
                            color: currentTheme.colors.textPrimary,
                            backgroundColor: currentTheme.colors.background,
                        },
                    ]}
                    placeholder="Yeni öğe"
                    placeholderTextColor={currentTheme.colors.textSecondary}
                    value={newItemName}
                    onChangeText={setNewItemName}
                />
                <TextInput
                    style={[
                        styles.quantityInput,
                        {
                            borderColor: currentTheme.colors.primary,
                            color: currentTheme.colors.textPrimary,
                            backgroundColor: currentTheme.colors.background,
                        },
                    ]}
                    placeholder="Miktar"
                    placeholderTextColor={currentTheme.colors.textSecondary}
                    value={newItemQuantity}
                    onChangeText={setNewItemQuantity}
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    style={[
                        styles.addButton,
                        { backgroundColor: currentTheme.colors.primary },
                    ]}
                    onPress={handleAddItem}
                    disabled={addingItem}
                >
                    {addingItem ? (
                        <ActivityIndicator
                            color={currentTheme.colors.textOnPrimary}
                        />
                    ) : (
                        <Ionicons
                            name="add"
                            size={24}
                            color={currentTheme.colors.textOnPrimary}
                        />
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

export default MarketListDetailScreen;