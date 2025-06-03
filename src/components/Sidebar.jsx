import React from 'react';
import { Drawer, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Dashboard, AttachMoney, Category, Assessment } from '@mui/icons-material'; // Import ikon
import { Link } from 'react-router-dom';

const drawerWidth = 240;

function Sidebar() {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            <Toolbar /> {/* Spacer untuk di bawah Navbar */}
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/">
                            <ListItemIcon>
                                <Dashboard />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/transactions">
                            <ListItemIcon>
                                <AttachMoney />
                            </ListItemIcon>
                            <ListItemText primary="Transaksi" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/categories">
                            <ListItemIcon>
                                <Category />
                            </ListItemIcon>
                            <ListItemText primary="Kategori" />
                        </ListItemButton>
                    </ListItem>
                    {/* Anda bisa menambahkan item menu lain di sini, misalnya untuk Laporan */}
                    {/* <ListItem disablePadding>
                        <ListItemButton component={Link} to="/reports">
                            <ListItemIcon>
                                <Assessment />
                            </ListItemIcon>
                            <ListItemText primary="Laporan" />
                        </ListItemButton>
                    </ListItem> */}
                </List>
            </Box>
        </Drawer>
    );
}

export default Sidebar;