import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Box, FormControl, FormLabel, RadioGroup,
    FormControlLabel, Radio, Alert, CircularProgress
} from '@mui/material';
import api from '../../services/api'; // Mengimpor instance Axios yang sudah dikonfigurasi

/**
 * Komponen CategoryForm untuk menambah atau mengedit kategori.
 * @param {object} props - Properti komponen.
 * @param {object} [props.category] - Objek kategori yang akan diedit (opsional, jika dalam mode edit).
 * @param {function} props.onSave - Callback yang dipanggil setelah kategori berhasil disimpan/diperbarui.
 * @param {function} props.onCancel - Callback yang dipanggil saat form dibatalkan.
 */
function CategoryForm({ category, onSave, onCancel }) {
    // State untuk menyimpan data form (nama dan jenis kategori)
    const [formData, setFormData] = useState({
        name: '',
        type: 'pengeluaran', // Nilai default untuk jenis kategori
    });
    // State untuk mengelola status loading (saat permintaan API sedang berjalan)
    const [loading, setLoading] = useState(false);
    // State untuk menyimpan pesan error yang akan ditampilkan kepada pengguna
    const [error, setError] = useState('');

    // Efek samping ini akan berjalan setiap kali properti 'category' berubah.
    // Digunakan untuk mengisi form saat dalam mode edit.
    useEffect(() => {
        if (category) {
            // Jika ada objek 'category' yang diberikan (mode edit), isi form dengan data kategori tersebut.
            setFormData({
                name: category.name,
                type: category.type,
            });
        } else {
            // Jika tidak ada objek 'category' (mode tambah baru), reset form ke nilai default.
            setFormData({
                name: '',
                type: 'pengeluaran',
            });
        }
    }, [category]); // Dependensi: efek ini akan dijalankan ulang jika 'category' berubah.

    // Handler untuk perubahan pada input form (TextField dan RadioGroup)
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Memperbarui state formData dengan nilai input yang baru
        setFormData({ ...formData, [name]: value });
    };

    // Handler untuk submit form
    const handleSubmit = async (e) => {
        e.preventDefault(); // Mencegah perilaku default form (refresh halaman)
        setLoading(true); // Aktifkan indikator loading
        setError(''); // Reset pesan error sebelumnya

        // Validasi dasar: pastikan nama dan jenis kategori tidak kosong
        if (!formData.name || !formData.type) {
            setError('Nama dan jenis kategori harus diisi.');
            setLoading(false);
            return; // Hentikan eksekusi jika validasi gagal
        }

        try {
            if (category) {
                // Jika 'category' ada, berarti ini adalah mode edit. Kirim permintaan PUT.
                await api.put(`/categories/${category.id}`, formData);
            } else {
                // Jika 'category' tidak ada, berarti ini adalah mode tambah baru. Kirim permintaan POST.
                await api.post('/categories', formData);
            }
            onSave(); // Panggil callback onSave dari parent untuk me-refresh daftar kategori dan menutup modal
        } catch (err) {
            console.error('Gagal menyimpan kategori:', err);
            // Tangani error dari respons API atau tampilkan pesan error umum
            setError(err.response?.data?.message || 'Gagal menyimpan kategori. Silakan coba lagi.');
        } finally {
            setLoading(false); // Nonaktifkan indikator loading setelah operasi selesai (berhasil atau gagal)
        }
    };

    return (
        <Box
            component="form" // Menentukan elemen HTML dasar adalah form
            onSubmit={handleSubmit} // Mengaitkan handler submit
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} // Gaya flexbox untuk tata letak vertikal
        >
            {/* Menampilkan pesan error jika state 'error' tidak kosong */}
            {error && <Alert severity="error">{error}</Alert>}

            {/* Input untuk Nama Kategori */}
            <TextField
                label="Nama Kategori" // Label input
                name="name" // Atribut 'name' untuk identifikasi di state
                value={formData.name} // Nilai input terikat dengan state formData.name
                onChange={handleChange} // Handler perubahan input
                fullWidth // Menggunakan lebar penuh dari parent
                required // Menandakan input wajib diisi
            />

            {/* Pilihan Jenis Kategori (Pemasukan/Pengeluaran) menggunakan RadioGroup */}
            <FormControl component="fieldset">
                <FormLabel component="legend">Jenis Kategori</FormLabel>
                <RadioGroup
                    row // Menampilkan radio button dalam satu baris
                    name="type" // Atribut 'name' untuk identifikasi di state
                    value={formData.type} // Nilai yang dipilih terikat dengan state formData.type
                    onChange={handleChange} // Handler perubahan radio button
                >
                    {/* Opsi Pemasukan */}
                    <FormControlLabel
                        value="pemasukan"
                        control={<Radio color="success" />} // Warna hijau untuk pemasukan
                        label="Pemasukan"
                    />
                    {/* Opsi Pengeluaran */}
                    <FormControlLabel
                        value="pengeluaran"
                        control={<Radio color="error" />} // Warna merah untuk pengeluaran
                        label="Pengeluaran"
                    />
                </RadioGroup>
            </FormControl>

            {/* Bagian tombol Simpan/Perbarui dan Batal */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button variant="outlined" onClick={onCancel} disabled={loading}>
                    Batal
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                    {/* Tampilkan CircularProgress saat loading, atau teks tombol sesuai mode (edit/tambah) */}
                    {loading ? <CircularProgress size={24} /> : (category ? 'Perbarui' : 'Simpan')}
                </Button>
            </Box>
        </Box>
    );
}

export default CategoryForm;
