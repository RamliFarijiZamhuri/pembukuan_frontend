import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useSnackbar } from 'notistack';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); // Ambil fungsi login dari AuthContext
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Mencegah refresh halaman

        if (!email || !password) {
            enqueueSnackbar('Email dan password harus diisi.', { variant: 'warning' });
            return;
        }

        const success = await login(email, password);
        if (success) {
            enqueueSnackbar('Login berhasil!', { variant: 'success' });
            navigate('/'); // Arahkan ke Dashboard jika login berhasil
        } else {
            enqueueSnackbar('Login gagal. Periksa kembali email dan password Anda.', { variant: 'error' });
        }
    };

    return (
        <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5" fontWeight="bold" gutterBottom>
                        Login
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Silakan masuk ke akun Anda
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Masuk
                        </Button>
                        <Link to="/register" style={{ textDecoration: 'none' }}>
                            <Typography variant="body2" align="center" color="primary">
                                Belum punya akun? Daftar di sini
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default LoginPage;