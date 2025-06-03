import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Box, Typography, Container, CircularProgress, Alert, Button, Modal, Fade, Backdrop } from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm'; // Akan dibuat
import AddIcon from '@mui/icons-material/Add';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 600 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: 'none',
};

function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]); // Untuk dropdown kategori di form
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null); // Untuk edit transaksi

    const fetchTransactionsAndCategories = async () => {
        setLoading(true);
        setError('');
        try {
            const [transactionsRes, categoriesRes] = await Promise.all([
                api.get('/transactions'),
                api.get('/categories')
            ]);
            // Urutkan transaksi berdasarkan tanggal terbaru
            const sortedTransactions = transactionsRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setTransactions(sortedTransactions);
            setCategories(categoriesRes.data);
        } catch (err) {
            console.error('Gagal memuat data transaksi/kategori:', err);
            setError('Gagal memuat transaksi atau kategori. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactionsAndCategories();
    }, []);

    const handleOpenModal = (transaction = null) => {
        setEditingTransaction(transaction);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingTransaction(null);
    };

    const handleTransactionSaved = () => {
        fetchTransactionsAndCategories(); // Muat ulang data setelah simpan/edit
        handleCloseModal();
    };

    const handleDeleteTransaction = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            try {
                await api.delete(`/transactions/${id}`);
                fetchTransactionsAndCategories(); // Muat ulang data
            } catch (err) {
                console.error('Gagal menghapus transaksi:', err);
                setError('Gagal menghapus transaksi. Silakan coba lagi.');
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Memuat Transaksi...</Typography>
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
                        Daftar Transaksi
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenModal()}
                    >
                        Tambah Transaksi
                    </Button>
                </Box>

                {transactions.length > 0 ? (
                    <TransactionList
                        transactions={transactions}
                        onEdit={handleOpenModal}
                        onDelete={handleDeleteTransaction}
                    />
                ) : (
                    <Typography>Belum ada transaksi. Tambahkan yang pertama!</Typography>
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
                                {editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
                            </Typography>
                            <TransactionForm
                                transaction={editingTransaction}
                                categories={categories}
                                onSave={handleTransactionSaved}
                                onCancel={handleCloseModal}
                            />
                        </Box>
                    </Fade>
                </Modal>
            </Box>
        </Box>
    );
}

export default TransactionsPage;