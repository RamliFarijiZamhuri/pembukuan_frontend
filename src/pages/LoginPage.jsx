import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); // Ambil fungsi login dari AuthContext
    const navigate = useNavigate();
    const [error, setError] = useState(''); // State untuk pesan error

    const handleSubmit = async (e) => {
        e.preventDefault(); // Mencegah refresh halaman
        setError(''); // Reset error message

        if (!email || !password) {
            setError('Email dan password harus diisi.');
            return;
        }

        const success = await login(email, password);
        if (success) {
            navigate('/'); // Arahkan ke Dashboard jika login berhasil
        } else {
            setError('Login gagal. Periksa kembali email dan password Anda.');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Alamat Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                            {error}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Masuk
                    </Button>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                        <Typography variant="body2" align="center">
                            Belum punya akun? Daftar di sini
                        </Typography>
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}

export default LoginPage;