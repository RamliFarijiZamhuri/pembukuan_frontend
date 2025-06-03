import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import AuthProvider dan useAuth

// Import Halaman-halaman
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import CategoriesPage from './pages/CategoriesPage';

// Komponen PrivateRoute untuk melindungi rute
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        // Tampilkan loading spinner saat memeriksa status otentikasi
        return <div>Memuat...</div>;
    }

    // Jika pengguna terotentikasi, tampilkan children (komponen halaman)
    // Jika tidak, arahkan ke halaman login
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            {/* Bungkus seluruh aplikasi dengan AuthProvider agar state otentikasi tersedia */}
            <AuthProvider>
                <Routes>
                    {/* Rute publik */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Rute yang dilindungi (memerlukan otentikasi) */}
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <DashboardPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/transactions"
                        element={
                            <PrivateRoute>
                                <TransactionsPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/categories"
                        element={
                            <PrivateRoute>
                                <CategoriesPage />
                            </PrivateRoute>
                        }
                    />
                    {/* Tambahkan rute lain yang dilindungi di sini */}

                    {/* Rute fallback untuk halaman tidak ditemukan */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;