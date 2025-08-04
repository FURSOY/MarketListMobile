import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import marketListApi from '../api/marketList';

const EditListModal = ({ visible, onClose, listToEdit, onListUpdated }) => {
    const { currentTheme } = useTheme();
    const [listName, setListName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Modal görünür olduğunda ve listToEdit doluysa ismi ayarla
        if (visible && listToEdit) {
            setListName(listToEdit.name);
        }
    }, [visible, listToEdit]); // Hem visible hem de listToEdit'i dinle

    const handleUpdate = async () => {
        if (listName.trim().length === 0) {
            Alert.alert('Hata', 'Liste adı boş olamaz.');
            return;
        }

        // listToEdit'in null olmadığını kontrol et
        if (!listToEdit) {
            console.error('Listeyi düzenlerken listToEdit objesi bulunamadı.');
            onClose();
            return;
        }

        if (listName === listToEdit.name) {
            onClose();
            return;
        }

        setLoading(true);
        try {
            await marketListApi.updateList(listToEdit.id, { name: listName }); // API çağrısını düzelt
            onListUpdated();
            onClose();
        } catch (error) {
            console.error('Listeyi güncellerken hata oluştu:', error.message);
            Alert.alert('Hata', 'Liste güncellenemedi. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView, { backgroundColor: currentTheme.colors.card }]}>
                    <Text style={[styles.modalTitle, { color: currentTheme.colors.textPrimary }]}>
                        Listeyi Düzenle
                    </Text>
                    <TextInput
                        style={[styles.input, { borderColor: currentTheme.colors.border, color: currentTheme.colors.textPrimary }]}
                        placeholder="Yeni liste adı"
                        placeholderTextColor={currentTheme.colors.textSecondary}
                        value={listName}
                        onChangeText={setListName}
                        autoFocus
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: currentTheme.colors.secondary }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.buttonText, { color: currentTheme.colors.textPrimary }]}>İptal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: currentTheme.colors.primary }]}
                            onPress={handleUpdate}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={currentTheme.colors.textOnPrimary} />
                            ) : (
                                <Text style={[styles.buttonText, { color: currentTheme.colors.textOnPrimary }]}>Kaydet</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    // Stil kodları aynı kalıyor
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditListModal;