import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar({ onMenuClick, isMobile }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Arahkan ke halaman login setelah logout
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                {isMobile && user && (
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={onMenuClick}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                    Pembukuan Bulanan
                </Typography>
                {user && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {!isMobile && (
                            <Typography variant="subtitle2" sx={{ mr: 2, opacity: 0.9 }}>
                                Halo, {user.username || user.email}!
                            </Typography>
                        )}
                        <Button color="inherit" onClick={handleLogout} variant="outlined" size="small" sx={{ borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#fff' } }}>
                            Logout
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;