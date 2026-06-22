import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function Layout({ children }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Navbar onMenuClick={handleDrawerToggle} isMobile={isMobile} />
            <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} isMobile={isMobile} />
            
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 },
                    mt: { xs: 7, sm: 8 },
                    width: { md: `calc(100% - 240px)` },
                    transition: 'width 0.3s',
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

export default Layout;
