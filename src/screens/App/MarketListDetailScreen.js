// src/screens/App/MarketListDetailScreen.js
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
    Switch
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import ShareInviteCodeModal from '../../components/ShareInviteCodeModal';

function MarketListDetailScreen({ route, navigation }) {
    const { listId, listName } = route.params;
    const { userToken, API_BASE_URL, userData } = useAuth();
    const { currentTheme } = useTheme();

    const [listDetails, setListDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('1');
    const [addingItem, setAddingItem] = useState(false);
    const [isShareModalVisible, setIsShareModalVisible] = useState(false);

    const isOwner = listDetails?.owner?.id === userData?.id; // Check if the current user is the owner

    const fetchListDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/lists/${listId}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            if (response.data.status === 'success') {
                setListDetails(response.data.list);
            } else {
                setError(response.data.message || 'Failed to fetch list details.');
            }
        } catch (err) {
            console.error('Error fetching list details:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Error fetching list details. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [listId, userToken, API_BASE_URL, userData]);

    useEffect(() => {
        fetchListDetails();
    }, [fetchListDetails]);

    // Set up header options dynamically
    useEffect(() => {
        navigation.setOptions({
            title: listName, // Use the listName passed as param
            headerRight: () => (
                isOwner ? ( // Only show if the current user is the owner
                    <TouchableOpacity
                        style={{ marginRight: 15 }}
                        onPress={() => setIsShareModalVisible(true)} // Open share modal
                    >
                        <Ionicons name="person-add-outline" size={30} color={currentTheme.colors.primary} />
                    </TouchableOpacity>
                ) : null
            ),
            headerStyle: {
                backgroundColor: currentTheme.colors.background,
            },
            headerTintColor: currentTheme.colors.text,
            headerTitleStyle: {
                color: currentTheme.colors.text,
            }
        });
    }, [navigation, listName, currentTheme, isOwner]); // Add isOwner to dependencies

    const handleRefresh = () => {
        setRefreshing(true);
        fetchListDetails();
    };

    const handleAddItem = async () => {
        if (!newItemName.trim()) {
            Alert.alert('Error', 'Item name cannot be empty.');
            return;
        }
        const quantity = parseInt(newItemQuantity, 10);
        if (isNaN(quantity) || quantity < 1) {
            Alert.alert('Error', 'Quantity must be a number greater than 0.');
            return;
        }

        setAddingItem(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/lists/${listId}/items`,
                { name: newItemName.trim(), quantity: quantity },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.status === 'success') {
                setNewItemName('');
                setNewItemQuantity('1');
                fetchListDetails(); // Refresh list to show new item
            } else {
                Alert.alert('Error', response.data.message || 'Failed to add item.');
            }
        } catch (err) {
            console.error('Error adding item:', err.response?.data || err.message);
            Alert.alert('Error', err.response?.data?.message || 'Failed to add item. Please try again.');
        } finally {
            setAddingItem(false);
        }
    };

    const toggleItemPurchased = async (itemId, isPurchased) => {
        try {
            const endpoint = isPurchased
                ? `${API_BASE_URL}/lists/${listId}/items/${itemId}/unpurchase`
                : `${API_BASE_URL}/lists/${listId}/items/${itemId}/purchase`;

            const response = await axios.patch(
                endpoint,
                {}, // Empty body for PATCH
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            if (response.data.status === 'success') {
                fetchListDetails(); // Refresh list to show updated status
            } else {
                Alert.alert('Error', response.data.message || 'Failed to update item status.');
            }
        } catch (err) {
            console.error('Error updating item status:', err.response?.data || err.message);
            Alert.alert('Error', err.response?.data?.message || 'Failed to update item status. Please try again.');
        }
    };

    const deleteItem = async (itemId) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            const response = await axios.delete(
                                `${API_BASE_URL}/lists/${listId}/items/${itemId}`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${userToken}`,
                                    },
                                }
                            );

                            // --- BURAYI GÜNCELLEYİN ---
                            // HTTP status 204 No Content başarılı bir silme işlemidir.
                            // Bu durumda response.data boş olabilir, bu yüzden response.status'ı kontrol edin.
                            if (response.status === 204) { // Eğer backend 204 döndürüyorsa
                                Alert.alert('Success', 'Item deleted successfully!'); // Başarılı mesajı göster
                                fetchListDetails(); // Listeyi yenile
                            } else if (response.data && response.data.status === 'success') {
                                // Eğer backend'den bir data objesi ve 'success' status'u geliyorsa (ki 204'te gelmez)
                                Alert.alert('Success', 'Item deleted successfully!');
                                fetchListDetails();
                            }
                            else {
                                // unexpected response format but not an error from network
                                Alert.alert('Error', response.data?.message || 'Failed to delete item with unexpected response.');
                            }
                        } catch (err) {
                            console.error('Error deleting item:', err.response?.data || err.message);
                            // Hata durumunda (örneğin 401, 403, 404, 500)
                            Alert.alert('Error', err.response?.data?.message || 'Failed to delete item. Please try again.');
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };


    const renderListItem = ({ item }) => (
        <View style={[styles.itemContainer, { backgroundColor: currentTheme.colors.cardBackground }]}>
            <View style={styles.itemMainInfo}>
                <Text style={[styles.itemName, { color: currentTheme.colors.text, textDecorationLine: item.isPurchased ? 'line-through' : 'none' }]}>
                    {item.name}
                </Text>
                {item.quantity > 1 && (
                    <Text style={[styles.itemQuantity, { color: currentTheme.colors.textSecondary }]}>
                        ({item.quantity})
                    </Text>
                )}
            </View>

            <View style={styles.itemActions}>
                <Switch
                    trackColor={{ false: currentTheme.colors.textSecondary, true: currentTheme.colors.primary }}
                    thumbColor={item.isPurchased ? currentTheme.colors.background : currentTheme.colors.background}
                    ios_backgroundColor={currentTheme.colors.textSecondary}
                    onValueChange={() => toggleItemPurchased(item.id, item.isPurchased)}
                    value={item.isPurchased}
                />
                <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={24} color={currentTheme.colors.error} />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: currentTheme.colors.background }]}>
                <ActivityIndicator size="large" color={currentTheme.colors.primary} />
                <Text style={{ color: currentTheme.colors.textSecondary, marginTop: 10 }}>Loading list...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.centered, { backgroundColor: currentTheme.colors.background }]}>
                <Text style={{ color: currentTheme.colors.error, textAlign: 'center' }}>{error}</Text>
                <TouchableOpacity onPress={fetchListDetails} style={styles.retryButton}>
                    <Text style={{ color: currentTheme.colors.buttonText }}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!listDetails) {
        return (
            <View style={[styles.centered, { backgroundColor: currentTheme.colors.background }]}>
                <Text style={{ color: currentTheme.colors.text }}>List not found or you don't have access.</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: currentTheme.colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Adjust as needed
        >
            {listDetails.items && listDetails.items.length === 0 ? (
                <View style={styles.emptyListContainer}>
                    <Ionicons name="cart-outline" size={60} color={currentTheme.colors.textSecondary} />
                    <Text style={[styles.emptyListText, { color: currentTheme.colors.text }]}>
                        This list is empty. Add some items!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={listDetails.items}
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

            <View style={[styles.addItemContainer, { borderTopColor: currentTheme.colors.border }]}>
                <TextInput
                    style={[styles.input, { backgroundColor: currentTheme.colors.background, color: currentTheme.colors.text, borderColor: currentTheme.colors.border }]}
                    placeholder="Add new item (e.g., Milk)"
                    placeholderTextColor={currentTheme.colors.textSecondary}
                    value={newItemName}
                    onChangeText={setNewItemName}
                    returnKeyType="done"
                    onSubmitEditing={handleAddItem}
                />
                <TextInput
                    style={[styles.quantityInput, { backgroundColor: currentTheme.colors.background, color: currentTheme.colors.text, borderColor: currentTheme.colors.border }]}
                    placeholder="Qty"
                    placeholderTextColor={currentTheme.colors.textSecondary}
                    keyboardType="numeric"
                    value={newItemQuantity}
                    onChangeText={(text) => setNewItemQuantity(text.replace(/[^0-9]/g, ''))} // Only allow numbers
                    returnKeyType="done"
                    onSubmitEditing={handleAddItem}
                />
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: currentTheme.colors.primary }]}
                    onPress={handleAddItem}
                    disabled={addingItem}
                >
                    {addingItem ? (
                        <ActivityIndicator size="small" color={currentTheme.colors.buttonText} />
                    ) : (
                        <Ionicons name="add-circle" size={30} color={currentTheme.colors.buttonText} />
                    )}
                </TouchableOpacity>
            </View>

            <ShareInviteCodeModal
                isVisible={isShareModalVisible}
                onClose={() => setIsShareModalVisible(false)}
                listId={listId}
                listName={listName}
            />
        </KeyboardAvoidingView>
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
        paddingHorizontal: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginVertical: 5,
        borderRadius: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    itemMainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemName: {
        fontSize: 17,
        fontWeight: '500',
        marginRight: 5,
    },
    itemQuantity: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    itemActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteButton: {
        marginLeft: 15,
        padding: 5,
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
    addItemContainer: {
        flexDirection: 'row',
        padding: 15,
        borderTopWidth: 1,
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 30 : 15, // Extra padding for iOS keyboard
    },
    input: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
        marginRight: 10,
    },
    quantityInput: {
        width: 60,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
        textAlign: 'center',
        marginRight: 10,
    },
    addButton: {
        padding: 8,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    retryButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#007AFF',
    }
});

export default MarketListDetailScreen;