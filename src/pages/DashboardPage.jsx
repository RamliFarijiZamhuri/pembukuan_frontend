import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Box, Typography, Container, Grid, CircularProgress } from '@mui/material';
import Layout from '../components/Layout';
import SummaryCard from '../components/common/SummaryCard';
import TransactionList from '../components/transactions/TransactionList';
import { useSnackbar } from 'notistack';

function DashboardPage() {
    const { user } = useAuth();
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const date = new Date();
                const year = date.getFullYear();
                const month = date.getMonth() + 1; // Bulan di JS 0-11, API 1-12

                // Ambil ringkasan bulanan
                const summaryRes = await api.get(`/transactions/summary?year=${year}&month=${month}`);
                setSummary(summaryRes.data);

                // Ambil transaksi terbaru (misal 5 transaksi terakhir)
                const transactionsRes = await api.get('/transactions');
                // Urutkan berdasarkan tanggal jika belum diurutkan dari backend
                const sortedTransactions = transactionsRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setRecentTransactions(sortedTransactions.slice(0, 5));

            } catch (err) {
                console.error('Gagal mengambil data dashboard:', err);
                enqueueSnackbar('Gagal memuat data dashboard. Silakan coba lagi.', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        if (user) { // Pastikan user sudah terload dari AuthContext
            fetchDashboardData();
        }
    }, [user, enqueueSnackbar]); // Jalankan ulang efek jika objek user berubah

    if (loading) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Memuat Dashboard...</Typography>
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <SummaryCard title="Total Pemasukan" amount={summary.totalIncome} type="income" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <SummaryCard title="Total Pengeluaran" amount={summary.totalExpense} type="expense" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <SummaryCard title="Saldo Bersih" amount={summary.balance} type="balance" />
                </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Transaksi Terbaru
                </Typography>
                {recentTransactions.length > 0 ? (
                     <TransactionList transactions={recentTransactions} />
                ) : (
                    <Typography>Belum ada transaksi terbaru.</Typography>
                )}
            </Box>

            {/* Anda bisa menambahkan bagian untuk grafik atau laporan di sini */}
        </Layout>
    );
}

export default DashboardPage;