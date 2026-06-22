import React from 'react';
import { Drawer, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Dashboard, AttachMoney, Category, Assessment } from '@mui/icons-material'; // Import ikon
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;

function Sidebar({ mobileOpen, handleDrawerToggle, isMobile }) {
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/' },
        { text: 'Transaksi', icon: <AttachMoney />, path: '/transactions' },
        { text: 'Kategori', icon: <Category />, path: '/categories' },
    ];

    const drawer = (
        <div>
            <Toolbar /> {/* Spacer untuk di bawah Navbar */}
            <Box sx={{ overflow: 'auto', mt: 2 }}>
                <List>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <ListItem key={item.text} disablePadding sx={{ mb: 1, px: 2 }}>
                                <ListItemButton 
                                    component={Link} 
                                    to={item.path}
                                    onClick={isMobile ? handleDrawerToggle : undefined}
                                    sx={{
                                        borderRadius: 2,
                                        backgroundColor: isActive ? 'primary.light' : 'transparent',
                                        color: isActive ? 'primary.contrastText' : 'text.primary',
                                        '&:hover': {
                                            backgroundColor: isActive ? 'primary.main' : 'action.hover',
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ color: isActive ? 'primary.contrastText' : 'inherit' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </div>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            aria-label="mailbox folders"
        >
            {isMobile ? (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            ) : (
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            )}
        </Box>
    );
}

export default Sidebar;