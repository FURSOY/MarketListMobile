// src/api/auth.js
import apiClient from './client'; // Mevcut apiClient'i import ediyoruz

const signup = (name, email, password) => apiClient.post('/auth/signup', { name, email, password }); // Endpoint'i güncelledim
const login = (email, password) => apiClient.post('/auth/login', { email, password }); // Endpoint'i güncelledim
const verifyEmail = (email, code) => apiClient.post('/auth/verify-email', { email, code }); // Endpoint'i güncelledim
const sendVerificationCode = (email) => apiClient.post('/auth/send-verification-code', { email }); // Yeni eklendi
const checkUser = () => apiClient.get('/user/me'); // Token ile kullanıcı bilgilerini çekmek için - Endpoint'i güncelledim

export default {
    signup,
    login,
    verifyEmail,
    sendVerificationCode,
    checkUser,
};