import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import marketListApi from '../api/marketList';
import Feather from '@expo/vector-icons/Feather';

const ListOptionsMenu = ({ list, onEdit, onDelete, onClose, onMembers }) => {
    const { currentTheme } = useTheme();

    const handleMembers = () => {
        onMembers(list);
        onClose();
    };

    const handleEdit = () => {
        onEdit(list);
        onClose();
    };

    const handleDelete = () => {
        Alert.alert(
            "Listeyi Sil",
            `"${list.name}" adlı listeyi silmek istediğinizden emin misiniz?`,
            [
                {
                    text: "İptal",
                    onPress: onClose,
                    style: "cancel"
                },
                {
                    text: "Sil",
                    onPress: async () => {
                        try {
                            await marketListApi.deleteList(list.id);
                            onDelete();
                            onClose();
                        } catch (error) {
                            console.error("Listeyi silerken hata oluştu:", error);
                            Alert.alert("Hata", "Liste silinemedi. Lütfen tekrar deneyin.");
                        }
                    },
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={[styles.menuContainer, { backgroundColor: currentTheme.colors.surface, shadowColor: currentTheme.colors.textPrimary }]}>
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: currentTheme.colors.border }]} onPress={handleEdit}>
                <Ionicons name="create-outline" size={20} color={currentTheme.colors.textPrimary} />
                <Text style={[styles.menuText, { color: currentTheme.colors.textPrimary }]}>İsmi Düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={20} color={currentTheme.colors.error} />
                <Text style={[styles.menuText, { color: currentTheme.colors.error }]}>Sil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleMembers}>
                <Feather name="users" size={20} color="black" />
                <Text style={[styles.menuText, { color: currentTheme.colors.textPrimary }]}>Üyeler</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    menuContainer: {
        position: 'absolute',
        right: 40,
        top: 40,
        borderRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000,
        width: 150,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    menuText: {
        marginLeft: 10,
        fontSize: 16,
    },
});

export default ListOptionsMenu;