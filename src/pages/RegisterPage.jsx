import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useSnackbar } from 'notistack';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !email || !password) {
            enqueueSnackbar('Semua kolom harus diisi.', { variant: 'warning' });
            return;
        }

        const success = await register(username, email, password);
        if (success) {
            enqueueSnackbar('Pendaftaran berhasil! Selamat datang.', { variant: 'success' });
            navigate('/'); // Arahkan ke Dashboard jika register berhasil
        } else {
            enqueueSnackbar('Pendaftaran gagal. Mungkin email atau username sudah digunakan.', { variant: 'error' });
        }
    };

    return (
        <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5" fontWeight="bold" gutterBottom>
                        Daftar Akun Baru
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Bergabunglah untuk mulai mencatat keuangan Anda
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Nama Pengguna"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Alamat Email"
                            name="email"
                            autoComplete="email"
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
                            autoComplete="new-password"
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
                            Daftar
                        </Button>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <Typography variant="body2" align="center" color="primary">
                                Sudah punya akun? Masuk di sini
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default RegisterPage;