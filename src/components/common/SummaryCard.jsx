import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function SummaryCard({ title, amount, type }) {
    let icon;
    let color;
    if (type === 'income') {
        icon = <MonetizationOnIcon color="success" sx={{ fontSize: 40 }} />;
        color = 'success.dark';
    } else if (type === 'expense') {
        icon = <MoneyOffIcon color="error" sx={{ fontSize: 40 }} />;
        color = 'error.dark';
    } else { // type === 'balance'
        icon = <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 40 }} />;
        color = 'primary.dark';
    }

    // Fungsi untuk memformat mata uang Rupiah
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0 // Tidak menampilkan desimal untuk Rupiah
        }).format(value);
    };

    return (
        <Card variant="outlined" sx={{ minWidth: 275, borderRadius: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" color="text.secondary">
                        {title}
                    </Typography>
                    {icon}
                </Box>
                <Typography variant="h4" component="div" sx={{ color: color, fontWeight: 'bold' }}>
                    {formatCurrency(amount)}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default SummaryCard;