// src/api/marketList.js
import apiClient from './client';

const createList = (name) => apiClient.post('/lists', { name });
const getUserLists = () => apiClient.get('/lists');
const getListDetails = (listId) => apiClient.get(`/lists/${listId}`);
const inviteUserToList = (listId, email) => apiClient.post(`/lists/${listId}/invite`, { email });
const joinListByInviteCode = (inviteCode) => apiClient.post(`/lists/join/${inviteCode}`);
const removeListMember = (listId, memberId) => apiClient.delete(`/lists/${listId}/members/${memberId}`);

const addListItem = (listId, name, quantity = 1) => apiClient.post(`/lists/${listId}/items`, { name, quantity });
const updateListItem = (listId, itemId, updates) => apiClient.patch(`/lists/${listId}/items/${itemId}`, updates);
const markItemAsPurchased = (listId, itemId) => apiClient.patch(`/lists/${listId}/items/${itemId}/purchase`);
const markItemAsUnpurchased = (listId, itemId) => apiClient.patch(`/lists/${listId}/items/${itemId}/unpurchase`);
const removeListItem = (listId, itemId) => apiClient.delete(`/lists/${listId}/items/${itemId}`);

export default {
    createList,
    getUserLists,
    getListDetails,
    inviteUserToList,
    joinListByInviteCode,
    removeListMember,
    addListItem,
    updateListItem,
    markItemAsPurchased,
    markItemAsUnpurchased,
    removeListItem,
};