import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, RadioGroup,
    FormControlLabel, Radio, FormLabel, CircularProgress
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import api from '../../services/api';
import { useSnackbar } from 'notistack';

function TransactionForm({ transaction, categories, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        type: 'pengeluaran',
        amount: '',
        description: '',
        category: '',
        date: dayjs(),
    });
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (transaction) {
            setFormData({
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                category: transaction.category?.id || '',
                date: dayjs(transaction.date),
            });
        } else {
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

        if (!formData.amount || !formData.description || !formData.category || !formData.date) {
            enqueueSnackbar('Semua kolom harus diisi.', { variant: 'warning' });
            setLoading(false);
            return;
        }
        if (isNaN(formData.amount) || formData.amount <= 0) {
            enqueueSnackbar('Jumlah harus angka positif.', { variant: 'warning' });
            setLoading(false);
            return;
        }

        try {
            const dataToSend = {
                ...formData,
                amount: parseFloat(formData.amount),
                date: formData.date.toISOString(),
            };

            if (transaction) {
                await api.put(`/transactions/${transaction.id}`, dataToSend);
            } else {
                await api.post('/transactions', dataToSend);
            }
            onSave();
        } catch (err) {
            console.error('Gagal menyimpan transaksi:', err);
            enqueueSnackbar(err.response?.data?.message || 'Gagal menyimpan transaksi. Silakan coba lagi.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const filteredCategories = categories.filter(cat => cat.type === formData.type);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : (transaction ? 'Perbarui' : 'Simpan')}
                    </Button>
                </Box>
            </Box>
        </LocalizationProvider>
    );
}

export default TransactionForm;