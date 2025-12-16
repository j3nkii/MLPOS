// src/config/axios.js
import axios from 'axios';

// Request interceptor
axios.interceptors.request.use(config => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor
// axios.interceptors.response.use(
//     response => response,
//     error => {
//         if (error.response?.status === 401) {
//             sessionStorage.clear();
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );

export default axios;