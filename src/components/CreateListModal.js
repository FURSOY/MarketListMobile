import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import marketListApi from '../api/marketList';

function CreateListModal({ visible, onClose, onListCreated }) {
    const { currentTheme } = useTheme();
    const [listName, setListName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateList = async () => {
        if (!listName.trim()) {
            Alert.alert('Hata', 'Lütfen bir liste adı girin.');
            return;
        }

        setLoading(true);
        try {
            const response = await marketListApi.createList(listName);
            if (response.status === 201) {
                Alert.alert('Başarılı', 'Yeni liste oluşturuldu.');
                setListName('');
                onClose();
                if (onListCreated) {
                    onListCreated();
                }
            }
        } catch (error) {
            console.error('Liste oluşturulamadı:', error);
            Alert.alert('Hata', 'Liste oluşturulurken bir sorun oluştu.');
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
                <View style={[
                    styles.modalView,
                    {
                        backgroundColor: currentTheme.colors.background,
                        padding: currentTheme.spacing.lg,
                        borderRadius: 10,
                        elevation: 5,
                    }
                ]}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close-circle-outline" size={30} color={currentTheme.colors.primary} />
                    </TouchableOpacity>

                    <Text style={[styles.modalTitle, { color: currentTheme.colors.textPrimary }]}>Yeni Liste Oluştur</Text>

                    <TextInput
                        style={[
                            styles.input,
                            {
                                borderColor: currentTheme.colors.primary,
                                color: currentTheme.colors.textPrimary,
                                marginBottom: currentTheme.spacing.md,
                            }
                        ]}
                        placeholder="Liste adı"
                        placeholderTextColor={currentTheme.colors.textSecondary}
                        value={listName}
                        onChangeText={setListName}
                    />

                    <TouchableOpacity
                        style={[
                            styles.createButton,
                            {
                                backgroundColor: currentTheme.colors.primary,
                            }
                        ]}
                        onPress={handleCreateList}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={currentTheme.colors.textOnPrimary} />
                        ) : (
                            <Text style={[styles.createButtonText, { color: currentTheme.colors.textOnPrimary }]}>Oluştur</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: '80%',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    createButton: {
        width: '100%',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CreateListModal;