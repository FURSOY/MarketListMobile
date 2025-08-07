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
    KeyboardAvoidingView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import marketListApi from '../api/marketList';

function CreateListMenu({ visible, onClose, onListCreated }) {
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
        <View style={styles.menuContainer}>
            <Text
                style={[
                    styles.Title,
                    { fontWeight: currentTheme.fontWeights.bold, color: currentTheme.colors.textPrimary, fontSize: currentTheme.fontSizes.xl }
                ]}
            >Yeni Liste Oluştur
            </Text>
            <TextInput
                style={[styles.input,
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
        </View >
    );
}

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
    // centeredView: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    // modalView: {
    //     width: '80%',
    //     alignItems: 'center',
    // },
    // closeButton: {
    //     position: 'absolute',
    //     top: 10,
    //     right: 10,
    // },
    // modalTitle: {
    //     fontSize: 20,
    //     fontWeight: 'bold',
    //     marginBottom: 20,
    // },
    // input: {
    //     width: '100%',
    //     borderWidth: 1,
    //     borderRadius: 5,
    //     padding: 10,
    // },
    // createButton: {
    //     width: '100%',
    //     padding: 12,
    //     borderRadius: 5,
    //     alignItems: 'center',
    // },
    // createButtonText: {
    //     fontSize: 16,
    //     fontWeight: 'bold',
    // },
});

export default CreateListMenu;