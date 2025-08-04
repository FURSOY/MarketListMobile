import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Clipboard, Alert, Share } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import marketListApi from '../api/marketList';

const AddMemberModal = ({ visible, onClose, listId }) => {
    const { currentTheme } = useTheme();
    const [inviteCode, setInviteCode] = useState('');
    const [inviteLink, setInviteLink] = useState('');

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Seni bir listeye davet ediyorum! Katılmak için bu linke tıkla:\n${inviteLink}`,
            });
        } catch (error) {
            console.error("Paylaşım hatası:", error);
            Alert.alert("Hata", "Bağlantı paylaşılamadı.");
        }
    };

    useEffect(() => {
        const fetchInviteCode = async () => {
            try {
                const response = await marketListApi.getListDetails(listId);
                const code = response.data.list.inviteCode;
                setInviteCode(code);
                setInviteLink(`https://yourapp.com/invite/${code}`);
            } catch (error) {
                console.error("Davet kodu alınamadı:", error);
                Alert.alert("Hata", "Davet kodu alınamadı.");
            }
        };

        if (visible && listId) {
            fetchInviteCode();
        }
    }, [visible, listId]);

    const handleCopy = () => {
        Clipboard.setString(inviteLink);
        Alert.alert("Kopyalandı", "Davet linki panoya kopyalandı.");
    };

    const styles = createStyles(currentTheme);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Entypo name="cross" size={40} color={currentTheme.colors.textPrimary} />
                    </TouchableOpacity>

                    <Text style={styles.title}>Yeni Üye Ekle</Text>

                    {inviteLink ? (
                        <View style={styles.codeBox}>
                            <View style={styles.CopyBox}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.inviteLink}>{inviteLink}</Text>
                                <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
                                    <FontAwesome name="copy" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.shareOptions}>
                                <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                                    <FontAwesome name="send" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <Text style={{ color: currentTheme.colors.textSecondary }}>Yükleniyor...</Text>
                    )}


                </View>
            </View>
        </Modal>
    );
};

const createStyles = (theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: theme.colors.background,
        borderRadius: 10,
        padding: 20,
        width: '85%',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
        marginBottom: 20,
    },
    closeBtn: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 5,
    },
    codeBox: {
        backgroundColor: theme.colors.card,
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },

    CopyBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingLeft: 10,
        borderRadius: 5,
    },
    inviteLink: {
        color: theme.colors.textPrimary,
        textAlign: 'center',
        paddingRight: 10,
        fontSize: theme.fontSizes.ml,
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        padding: 8,
        borderRadius: 5,
    },
    shareOptions: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-around',
        width: '100%',
    },
    shareButton: {
        backgroundColor: theme.colors.primary,
        padding: 10,
        borderRadius: 10,
    },
});

export default AddMemberModal;