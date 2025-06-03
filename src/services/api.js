import axios from 'axios';

// Ambil URL API dari variabel lingkungan
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Buat instance Axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor untuk menambahkan token ke setiap request yang memerlukan otentikasi
api.interceptors.request.use((config) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    } catch (e) {
        console.error("Failed to parse user from localStorage", e);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;