// src/components/ShareInviteCodeModal.js
import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Share,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import axios from 'axios';

// Assuming you have a constants file for deep link base URL
// For development, this could be your Expo tunnel URL or a custom scheme
// For production, this should be your custom domain for deep linking (e.g., https://marketlist.app)
const APP_DEEPLINK_BASE_URL = 'marketlistapp://'; // Replace with your actual app scheme or domain

function ShareInviteCodeModal({ isVisible, onClose, listId, listName }) {
    const { userToken, API_BASE_URL } = useAuth();
    const { currentTheme } = useTheme();

    const [inviteCode, setInviteCode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInviteCode = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/lists/${listId}/invite`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            if (response.data.status === 'success') {
                setInviteCode(response.data.inviteCode);
            } else {
                setError(response.data.message || 'Failed to get invite code.');
            }
        } catch (err) {
            console.error('Error fetching invite code:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Error fetching invite code.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isVisible && listId) {
            fetchInviteCode();
        }
    }, [isVisible, listId]);

    // Construct the full deep link URL
    const fullInviteLink = inviteCode ? `${APP_DEEPLINK_BASE_URL}joinList?code=${inviteCode}` : '';

    const copyInviteLinkToClipboard = async () => {
        if (fullInviteLink) {
            await Clipboard.setStringAsync(fullInviteLink);
            Alert.alert('Copied!', 'Invite link copied to clipboard.');
        }
    };

    const onShare = async () => {
        if (fullInviteLink) {
            try {
                const result = await Share.share({
                    message: `Join my "${listName}" list! Click this link to join:\n\n${fullInviteLink}\n\nDownload the MarketList App if you haven't already!`,
                    title: `Invite to ${listName}`
                });
                if (result.action === Share.sharedAction) {
                    // shared
                } else if (result.action === Share.dismissedAction) {
                    // dismissed
                }
            } catch (shareError) {
                Alert.alert('Error', 'Failed to share invite link.');
                console.error('Error sharing:', shareError);
            }
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView, { backgroundColor: currentTheme.colors.cardBackground }]}>
                    <Text style={[styles.modalTitle, { color: currentTheme.colors.text }]}>Share List Invitation</Text>

                    {loading ? (
                        <ActivityIndicator size="large" color={currentTheme.colors.primary} />
                    ) : error ? (
                        <Text style={[styles.errorText, { color: currentTheme.colors.error }]}>{error}</Text>
                    ) : inviteCode ? (
                        <>
                            <Text style={[styles.inviteText, { color: currentTheme.colors.textSecondary }]}>
                                Share this link to invite others to "{listName}":
                            </Text>
                            <View style={[styles.inviteLinkContainer, { borderColor: currentTheme.colors.border }]}>
                                <Text style={[styles.inviteLinkText, { color: currentTheme.colors.primary }]} numberOfLines={1} ellipsizeMode="tail">
                                    {fullInviteLink}
                                </Text>
                                <TouchableOpacity onPress={copyInviteLinkToClipboard} style={styles.copyButton}>
                                    <Ionicons name="copy-outline" size={24} color={currentTheme.colors.primary} />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={[styles.shareButton, { backgroundColor: currentTheme.colors.primary }]}
                                onPress={onShare}
                            >
                                <Ionicons name="share-social-outline" size={24} color={currentTheme.colors.buttonText} />
                                <Text style={[styles.shareButtonText, { color: currentTheme.colors.buttonText, marginLeft: 10 }]}>
                                    Share Invitation
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <Text style={[styles.errorText, { color: currentTheme.colors.textSecondary }]}>
                            No invite code available.
                        </Text>
                    )}

                    <TouchableOpacity
                        style={[styles.closeButton, { backgroundColor: currentTheme.colors.secondary }]}
                        onPress={onClose}
                    >
                        <Text style={[styles.buttonText, { color: currentTheme.colors.buttonText }]}>Close</Text>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '85%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    inviteText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15,
    },
    inviteLinkContainer: { // Renamed from inviteCodeContainer
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        width: '100%',
        justifyContent: 'space-between',
    },
    inviteLinkText: { // Renamed from inviteCodeText
        fontSize: 16, // Adjusted for readability of a longer URL
        fontWeight: 'bold',
        flexShrink: 1,
        marginRight: 10, // Add some margin
    },
    copyButton: {
        padding: 5,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,
        width: '100%',
    },
    shareButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 20,
    }
});

export default ShareInviteCodeModal;