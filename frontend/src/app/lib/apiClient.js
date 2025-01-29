// src/api/apiClient.js
import axios from 'axios';

// Konfigurasi dasar Axios
const apiClient = axios.create({
    baseURL: 'http://localhost:2000/api/', // Ganti dengan URL backend Anda
    // baseURL: 'https://face-recognition-lyart.vercel.app/api/', // Ganti dengan URL backend Anda
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor untuk menyertakan token pada setiap permintaan
// apiClient.interceptors.request.use(config => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, error => {
//     return Promise.reject(error);
// });

// Interceptor untuk menangani error response
// apiClient.interceptors.response.use(response => response, error => {
//     if (error.response.status === 401) {
//         // Handle unauthorized errors
//         // Redirect to login or refresh token
//     }
//     return Promise.reject(error);
// });

export default apiClient;
