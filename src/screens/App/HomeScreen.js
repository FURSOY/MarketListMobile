import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import marketListApi from '../../api/marketList';
import { createMarketListStyles } from '../../styles/MarketListStyles';
import { Ionicons } from '@expo/vector-icons';
import CreateListMenu from '../../components/CreateListMenu';
import EditListModal from '../../components/EditListModal';
import MembersModal from '../../components/MembersModal';
import ListOptionsMenu from '../../components/ListOptionsMenu';
import { useAuth } from '../../context/AuthContext';
import Entypo from '@expo/vector-icons/Entypo';
import AddMemberModal from '../../components/AddMemberModal'; // doğru yolu yaz

function HomeScreen({ navigation }) {
    const { currentTheme } = useTheme();
    const styles = createMarketListStyles(currentTheme);

    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [createMenuShow, setCreateMenuShow] = useState(false);
    const [editMenuShow, setEditMenuShow] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    const [optionsMenuShow, setOptionsMenuShow] = useState(false);
    const [membersModalVisible, setMembersModalVisible] = useState(false);
    const [selectedListId, setSelectedListId] = useState(null);
    const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);


    const { userData } = useAuth();


    const handleMembers = useCallback((list) => {
        setSelectedListId(list.id);
        setMembersModalVisible(true);
        setOptionsMenuShow(false);
    }, []);


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
        await loadLists();
        setRefreshing(false);
    }, [loadLists]);

    const handleCreateModalOpen = useCallback(() => {
        setCreateMenuShow(true);
    }, []);

    const handleCreateModalClose = useCallback(() => {
        setCreateMenuShow(false);
        loadLists();
    }, [loadLists]);

    const handleListPress = useCallback((list) => {
        navigation.navigate('MarketListDetail', { listId: list.id, listName: list.name });
    }, [navigation]);

    const handleOptionsMenuOpen = useCallback((item) => {
        setSelectedList(item);
        setOptionsMenuShow(true);
    }, []);

    const handleOptionsMenuClose = useCallback(() => {
        setOptionsMenuShow(false);
        // Menü kapandığında selectedList'i null yapmamız gerekiyor,
        // ancak bu işlemi EditListModal açılmadan önce yaparsak sorun oluşur.
        // Bu yüzden, edit modalı açılınca bu işlemi yapmayacağız.
        // Yeni yaklaşımda bu durum otomatik yönetilecek.
    }, []);

    // GÜNCELLENDİ: Edit işlemi için yeni bir fonksiyon
    const handleEditList = useCallback((list) => {
        setSelectedList(list); // Hangi listenin düzenleneceğini belirle
        setEditMenuShow(true); // Edit modalını aç
        setOptionsMenuShow(false); // ListOptionsMenu'yi kapat
    }, []);

    const handleEditModalClose = useCallback(() => {
        setEditMenuShow(false);
        setSelectedList(null); // Modal kapandığında selectedList'i temizle
        loadLists();
    }, [loadLists]);

    const handleDeleteList = useCallback(() => {
        loadLists();
    }, [loadLists]);

    useEffect(() => {
        loadLists();
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 15 }} onPress={handleCreateModalOpen}>
                    <Ionicons name="add-circle-outline" size={30} color={currentTheme.colors.primary} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, currentTheme, handleCreateModalOpen, loadLists]);

    const renderItem = ({ item }) => {
        const isOwner = userData && item.ownerId === userData.id;
        const isMenuOpen = optionsMenuShow && selectedList?.id === item.id;

        return (
            <View>
                <TouchableOpacity
                    style={styles.listItemContainer}
                    onPress={() => handleListPress(item)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.listItemText}>{item.name}</Text>
                    {isOwner && (
                        <TouchableOpacity
                            style={styles.optionsButton}
                            onPress={() =>
                                isMenuOpen
                                    ? handleOptionsMenuClose()
                                    : handleOptionsMenuOpen(item)
                            }
                        >
                            <Entypo
                                name="dots-three-horizontal"
                                size={24}
                                color={currentTheme.colors.textPrimary}
                            />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <TouchableWithoutFeedback onPress={handleOptionsMenuClose}>
            <View style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color={currentTheme.colors.textPrimary} />
                ) : lists.length === 0 ? (
                    <Text style={styles.emptyText}>Liste bulunmamakta</Text>
                ) : (
                    <FlatList
                        data={lists}
                        keyExtractor={(item) => item.id.toString()}
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
                <CreateListMenu
                    visible={createMenuShow}
                    onClose={handleCreateModalClose}
                    onListCreated={loadLists}
                />
                <EditListModal
                    visible={editMenuShow}
                    onClose={handleEditModalClose}
                    listToEdit={selectedList}
                    onListUpdated={loadLists}
                />
                <MembersModal
                    visible={membersModalVisible}
                    onClose={() => setMembersModalVisible(false)}
                    listId={selectedListId}
                    list={selectedList}
                    onAddMember={() => setAddMemberModalVisible(true)}
                />
                <AddMemberModal
                    visible={addMemberModalVisible}
                    onClose={() => setAddMemberModalVisible(false)}
                    listId={selectedListId}
                />
                {optionsMenuShow && selectedList && (
                    <ListOptionsMenu
                        list={selectedList}
                        onEdit={handleEditList}
                        onDelete={handleDeleteList}
                        onClose={handleOptionsMenuClose}
                        onMembers={handleMembers}
                        userData={userData}
                    />
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}

export default HomeScreen;