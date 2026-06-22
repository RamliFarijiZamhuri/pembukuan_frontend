import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Box, FormControl, FormLabel, RadioGroup,
    FormControlLabel, Radio, CircularProgress
} from '@mui/material';
import api from '../../services/api'; // Mengimpor instance Axios yang sudah dikonfigurasi
import { useSnackbar } from 'notistack';

function CategoryForm({ category, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'pengeluaran',
    });
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                type: category.type,
            });
        } else {
            setFormData({
                name: '',
                type: 'pengeluaran',
            });
        }
    }, [category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.name || !formData.type) {
            enqueueSnackbar('Nama dan jenis kategori harus diisi.', { variant: 'warning' });
            setLoading(false);
            return;
        }

        try {
            if (category) {
                await api.put(`/categories/${category.id}`, formData);
            } else {
                await api.post('/categories', formData);
            }
            onSave();
        } catch (err) {
            console.error('Gagal menyimpan kategori:', err);
            enqueueSnackbar(err.response?.data?.message || 'Gagal menyimpan kategori. Silakan coba lagi.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
            <TextField
                label="Nama Kategori"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
            />

            <FormControl component="fieldset">
                <FormLabel component="legend">Jenis Kategori</FormLabel>
                <RadioGroup
                    row
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                >
                    <FormControlLabel
                        value="pemasukan"
                        control={<Radio color="success" />}
                        label="Pemasukan"
                    />
                    <FormControlLabel
                        value="pengeluaran"
                        control={<Radio color="error" />}
                        label="Pengeluaran"
                    />
                </RadioGroup>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button variant="outlined" onClick={onCancel} disabled={loading}>
                    Batal
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : (category ? 'Perbarui' : 'Simpan')}
                </Button>
            </Box>
        </Box>
    );
}

export default CategoryForm;
