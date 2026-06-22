import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
    Chip, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function TransactionList({ transactions, onEdit, onDelete }) {
    if (!transactions || transactions.length === 0) {
        return <Typography sx={{ mt: 2 }}>Tidak ada transaksi untuk ditampilkan.</Typography>;
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="daftar transaksi">
                <TableHead>
                    <TableRow>
                        <TableCell>Tanggal</TableCell>
                        <TableCell>Deskripsi</TableCell>
                        <TableCell>Kategori</TableCell>
                        <TableCell align="right">Jumlah</TableCell>
                        <TableCell>Jenis</TableCell>
                        <TableCell align="center">Aksi</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow
                            key={transaction.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {formatDate(transaction.date)}
                            </TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>{transaction.category?.name || 'Tidak Diketahui'}</TableCell>
                            <TableCell align="right" sx={{
                                color: transaction.type === 'pemasukan' ? 'green' : 'red',
                                fontWeight: 'bold'
                            }}>
                                {formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={transaction.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                                    color={transaction.type === 'pemasukan' ? 'success' : 'error'}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell align="center">
                                <IconButton onClick={() => onEdit(transaction)} color="primary" size="small">
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton onClick={() => onDelete(transaction.id)} color="error" size="small">
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TransactionList;