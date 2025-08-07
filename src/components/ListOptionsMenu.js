import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import marketListApi from '../api/marketList';

const ListOptionsMenu = ({ list, onEdit, onDelete, onClose, onMembers, userData }) => {
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
        <View style={styles.menuContainer}>
            <Text
                style={[
                    styles.Title,
                    { fontWeight: currentTheme.fontWeights.bold, color: currentTheme.colors.textPrimary, fontSize: currentTheme.fontSizes.xl }
                ]}
            >{list.name}
            </Text>
            {list.ownerId === userData.id && (
                <>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={handleEdit}
                    >
                        <Ionicons name="create-outline" size={24} color={currentTheme.colors.textPrimary} />
                        <Text style={[styles.menuText, { color: currentTheme.colors.textPrimary, fontSize: currentTheme.fontSizes.ml, fontWeight: currentTheme.fontWeights.medium }]}>İsmi Düzenle</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={handleDelete}
                    >
                        <Ionicons name="trash-outline" size={24} color={currentTheme.colors.error} />
                        <Text style={[styles.menuText, { color: currentTheme.colors.error, fontSize: currentTheme.fontSizes.ml, fontWeight: currentTheme.fontWeights.medium }]}>Sil</Text>
                    </TouchableOpacity>
                </>
            )
            }
            <TouchableOpacity style={styles.menuItem} onPress={handleMembers}>
                <Ionicons name="people-outline" size={24} color={currentTheme.colors.textPrimary} />
                <Text style={[styles.menuText, { color: currentTheme.colors.textPrimary, fontSize: currentTheme.fontSizes.ml, fontWeight: currentTheme.fontWeights.medium }]}>Üyeler</Text>
            </TouchableOpacity>
        </View >
    );
};

const styles = StyleSheet.create({
    menuContainer: {
        backgroundColor: 'white',
        width: "100%",
        height: 250,
        position: 'absolute',
        bottom: 0,
        left: 0,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 10,
    },
    Title: {
        textAlign: 'center',
        marginBottom: 10,
    },
    menuItem: {
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
        height: 65,
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
    },
    menuText: {
        marginLeft: 10
    }
});

export default ListOptionsMenu;