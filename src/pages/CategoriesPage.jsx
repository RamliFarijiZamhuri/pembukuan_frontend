import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
    Box, Typography, Container, CircularProgress, Alert, Button, Modal, Fade, Backdrop,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CategoryForm from '../components/categories/CategoryForm'; // Akan dibuat
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: 'none',
};

function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (err) {
            console.error('Gagal memuat kategori:', err);
            setError('Gagal memuat kategori. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (category = null) => {
        setEditingCategory(category);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingCategory(null);
    };

    const handleCategorySaved = () => {
        fetchCategories(); // Muat ulang data setelah simpan/edit
        handleCloseModal();
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini? Transaksi yang terkait mungkin terpengaruh.')) {
            try {
                await api.delete(`/categories/${id}`);
                fetchCategories(); // Muat ulang data
            } catch (err) {
                console.error('Gagal menghapus kategori:', err);
                setError('Gagal menghapus kategori. Pastikan tidak ada transaksi yang menggunakan kategori ini.');
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Memuat Kategori...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex' }}>
                <Navbar />
                <Sidebar />
                <Container sx={{ mt: 10, p: 3 }}>
                    <Alert severity="error">{error}</Alert>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Navbar />
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4">
                        Daftar Kategori
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenModal()}
                    >
                        Tambah Kategori
                    </Button>
                </Box>

                {categories.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nama Kategori</TableCell>
                                    <TableCell>Jenis</TableCell>
                                    <TableCell align="right">Aksi</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>{category.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleOpenModal(category)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteCategory(category.id)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography>Belum ada kategori. Tambahkan yang pertama!</Typography>
                )}

                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={openModal}
                    onClose={handleCloseModal}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={openModal}>
                        <Box sx={modalStyle}>
                            <Typography id="transition-modal-title" variant="h6" component="h2" mb={2}>
                                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                            </Typography>
                            <CategoryForm
                                category={editingCategory}
                                onSave={handleCategorySaved}
                                onCancel={handleCloseModal}
                            />
                        </Box>
                    </Fade>
                </Modal>
            </Box>
        </Box>
    );
}

export default CategoriesPage;