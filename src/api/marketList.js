import apiClient from './client';

const createList = (name) => apiClient.post('/lists', { name });
const getUserLists = () => apiClient.get('/lists');
const getListDetails = (listId) => apiClient.get(`/lists/${listId}`);
const getListCode = (listId) => apiClient.post(`/lists/${listId}/invite`);
const updateList = (listId, data) => apiClient.patch(`/lists/${listId}`, data);
const deleteList = (listId) => apiClient.delete(`/lists/${listId}`);
const joinListByInviteCode = (inviteCode) => apiClient.post(`/lists/join/${inviteCode}`);
const removeListMember = (listId, memberId) => apiClient.delete(`/lists/${listId}/members/${memberId}`);
const getListMembers = (listId) => apiClient.get(`/lists/${listId}/members`);

const addListItem = (listId, name, quantity = 1) => apiClient.post(`/lists/${listId}/items`, { name, quantity });
const updateListItem = (listId, itemId, updates) => apiClient.patch(`/lists/${listId}/items/${itemId}`, updates);
const markItemAsPurchased = (listId, itemId) => apiClient.patch(`/lists/${listId}/items/${itemId}/purchase`);
const markItemAsUnpurchased = (listId, itemId) => apiClient.patch(`/lists/${listId}/items/${itemId}/unpurchase`);
const removeListItem = (listId, itemId) => apiClient.delete(`/lists/${listId}/items/${itemId}`);

export default {
    createList,
    getUserLists,
    getListDetails,
    getListCode,
    joinListByInviteCode,
    removeListMember,
    addListItem,
    updateListItem,
    markItemAsPurchased,
    markItemAsUnpurchased,
    removeListItem,
    updateList,
    deleteList,
    getListMembers
};