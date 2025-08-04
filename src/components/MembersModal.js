import React, { useCallback, useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import marketListApi from '../api/marketList';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const MembersModal = ({ visible, onClose, listId, list, onMemberRemoved, onAddMember }) => {
    const { currentTheme } = useTheme();
    const { userData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState([]);

    const loadMembers = useCallback(async () => {
        if (!listId) return;
        setLoading(true);
        try {
            const response = await marketListApi.getListMembers(listId);
            let data = response.data?.members || [];

            // Owner'ı başa alacak şekilde sırala:
            data.sort((a, b) => {
                if (a.role === 'owner') return -1;
                if (b.role === 'owner') return 1;
                return 0;
            });

            setMembers(data);
        } catch (error) {
            console.error('Üyeler alınamadı:', error.message);
            setMembers([]);
        } finally {
            setLoading(false);
        }
    }, [listId]);

    useEffect(() => {
        if (visible) {
            loadMembers();
        }
    }, [visible, loadMembers]);

    const handleRemoveMember = useCallback((memberId) => {
        Alert.alert(
            "Üyeyi Sil",
            "Bu üyeyi listeden kaldırmak istediğinize emin misiniz?",
            [
                {
                    text: "İptal",
                    style: "cancel",
                },
                {
                    text: "Sil",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await marketListApi.removeListMember(listId, memberId);
                            await loadMembers();
                            if (onMemberRemoved) onMemberRemoved();
                        } catch (error) {
                            console.error('Üye silinirken hata oluştu:', error.message);
                            Alert.alert('Hata', 'Üye silinemedi. Lütfen tekrar deneyin.');
                        }
                    }
                }
            ],
            { cancelable: true }
        );
    }, [listId, loadMembers, onMemberRemoved]);

    const styles = createStyles(currentTheme);

    const renderItem = ({ item }) => {
        const isListOwner = userData?.id && list?.ownerId === userData.id;

        return (
            <View style={styles.Member}>
                <View>
                    <Text style={{ color: currentTheme.colors.textPrimary, fontWeight: '700', fontSize: 18 }}>
                        {item.user.name}
                    </Text>
                    <Text style={{ color: currentTheme.colors.textSecondary }}>
                        Rol: {item.role}
                    </Text>
                </View>
                {isListOwner && (
                    item.role === 'owner' ? (
                        <AntDesign name="star" size={24} color={currentTheme.colors.warning} />
                    ) : (
                        <TouchableOpacity onPress={() => handleRemoveMember(item.id)}>
                            <Entypo name="cross" size={30} color={currentTheme.colors.error} />
                        </TouchableOpacity>
                    )
                )}
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Entypo name="cross" size={40} color={currentTheme.colors.textPrimary} />
                    </TouchableOpacity>

                    <Text style={styles.title}>Üyeler</Text>

                    <FlatList
                        style={styles.MemberContainer}
                        data={members}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            !loading && (
                                <Text style={{ color: currentTheme.colors.textSecondary }}>
                                    Üye bulunamadı.
                                </Text>
                            )
                        }
                    />
                    <TouchableOpacity
                        style={styles.addMemberButton}
                        onPress={onAddMember}
                    >
                        <FontAwesome6 style={{ position: "absolute", left: 10 }} name="user-plus" size={24} color="white" />
                        <Text style={{
                            fontSize: currentTheme.fontSizes.ml,
                            fontWeight: currentTheme.fontWeights.bold,
                            color: "white"
                        }}>
                            Add Member
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const createStyles = (theme) =>
    StyleSheet.create({
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            backgroundColor: theme.colors.background,
            borderRadius: 10,
            paddingVertical: theme.spacing.xxl,
            paddingHorizontal: theme.spacing.ld,
            width: '85%',
            maxHeight: '80%',
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            color: theme.colors.textPrimary,
            textAlign: 'center',
        },
        closeBtn: {
            position: 'absolute',
            top: 0,
            right: 0,
            padding: 5,
            zIndex: 10,
        },
        MemberContainer: {
            borderWidth: 1,
            borderColor: theme.colors.border,
            paddingHorizontal: theme.spacing.sm,
            borderRadius: 10,
            maxHeight: 230,
        },
        Member: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 15,
        },
        addMemberButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.primary,
            paddingVertical: 15,
            borderRadius: 5,
            marginTop: 20,
        }
    });

export default MembersModal;
