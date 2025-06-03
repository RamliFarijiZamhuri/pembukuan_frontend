import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api'; // Import instance API kita

// Buat Context
const AuthContext = createContext();

// Provider untuk Context
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Efek untuk memuat data pengguna dari localStorage saat aplikasi dimuat
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error("Failed to parse user from localStorage on load", e);
            localStorage.removeItem('user'); // Hapus data yang rusak
        } finally {
            setLoading(false);
        }
    }, []);

    // Fungsi untuk login
    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const userData = response.data;
            localStorage.setItem('user', JSON.stringify(userData)); // Simpan di localStorage
            setUser(userData);
            return true; // Login berhasil
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            // Anda bisa menambahkan state untuk pesan error di sini dan menampilkannya di UI
            return false; // Login gagal
        }
    };

    // Fungsi untuk register
    const register = async (username, email, password) => {
        try {
            const response = await api.post('/auth/register', { username, email, password });
            const userData = response.data;
            localStorage.setItem('user', JSON.stringify(userData)); // Simpan di localStorage
            setUser(userData);
            return true; // Register berhasil
        } catch (error) {
            console.error('Registration failed:', error.response?.data?.message || error.message);
            return false; // Register gagal
        }
    };

    // Fungsi untuk logout
    const logout = () => {
        localStorage.removeItem('user'); // Hapus dari localStorage
        setUser(null); // Hapus dari state
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook untuk menggunakan Auth Context
export const useAuth = () => useContext(AuthContext);