import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, RadioGroup,
    FormControlLabel, Radio, FormLabel, Alert, CircularProgress
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import api from '../../services/api';

function TransactionForm({ transaction, categories, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        type: 'pengeluaran', // Default
        amount: '',
        description: '',
        category: '',
        date: dayjs(), // Default ke tanggal hari ini
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (transaction) {
            // Jika dalam mode edit, isi form dengan data transaksi yang ada
            setFormData({
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                category: transaction.category?.id || '', // Pastikan mengambil id kategori
                date: dayjs(transaction.date),
            });
        } else {
            // Reset form jika tidak ada transaksi yang diedit
            setFormData({
                type: 'pengeluaran',
                amount: '',
                description: '',
                category: '',
                date: dayjs(),
            });
        }
    }, [transaction]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, date: date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validasi dasar
        if (!formData.amount || !formData.description || !formData.category || !formData.date) {
            setError('Semua kolom harus diisi.');
            setLoading(false);
            return;
        }
        if (isNaN(formData.amount) || formData.amount <= 0) {
            setError('Jumlah harus angka positif.');
            setLoading(false);
            return;
        }

        try {
            const dataToSend = {
                ...formData,
                amount: parseFloat(formData.amount), // Pastikan jumlah adalah angka
                date: formData.date.toISOString(), // Format tanggal ke ISO string untuk backend
            };

            if (transaction) {
                // Mode edit
                await api.put(`/transactions/${transaction.id}`, dataToSend);
            } else {
                // Mode tambah baru
                await api.post('/transactions', dataToSend);
            }
            onSave(); // Panggil fungsi onSave dari parent untuk refresh data
        } catch (err) {
            console.error('Gagal menyimpan transaksi:', err);
            setError(err.response?.data?.message || 'Gagal menyimpan transaksi. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    // Filter kategori berdasarkan tipe transaksi yang dipilih
    const filteredCategories = categories.filter(cat => cat.type === formData.type);


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}

                <FormControl component="fieldset">
                    <FormLabel component="legend">Jenis Transaksi</FormLabel>
                    <RadioGroup
                        row
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <FormControlLabel value="pemasukan" control={<Radio color="success" />} label="Pemasukan" />
                        <FormControlLabel value="pengeluaran" control={<Radio color="error" />} label="Pengeluaran" />
                    </RadioGroup>
                </FormControl>

                <DatePicker
                    label="Tanggal"
                    value={formData.date}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                />

                <TextField
                    label="Jumlah"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    fullWidth
                    required
                />

                <FormControl fullWidth required>
                    <InputLabel id="category-label">Kategori</InputLabel>
                    <Select
                        labelId="category-label"
                        id="category"
                        name="category"
                        value={formData.category}
                        label="Kategori"
                        onChange={handleChange}
                    >
                        <MenuItem value="">
                            <em>Pilih Kategori</em>
                        </MenuItem>
                        {filteredCategories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Deskripsi"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    fullWidth
                    required
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button variant="outlined" onClick={onCancel} disabled={loading}>
                        Batal
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : (transaction ? 'Perbarui' : 'Simpan')}
                    </Button>
                </Box>
            </Box>
        </LocalizationProvider>
    );
}

export default TransactionForm;