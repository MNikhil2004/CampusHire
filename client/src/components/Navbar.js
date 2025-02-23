import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Chip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ 
          flexGrow: 1, 
          textDecoration: 'none', 
          color: 'inherit' 
        }}>
          CareerBridge
        </Typography>
        
        {user ? (
          // Logged in navigation
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {user.role === 'user' ? (
              // Student Navigation
              <Button 
                color="inherit" 
                component={Link} 
                to="/"
              >
                Latest Jobs
              </Button>
            ) : user.role === 'jobholder' ? (
              // Job Holder Navigation
              <Button 
                color="inherit" 
                component={Link} 
                to="/jobholder/dashboard"
              >
                Dashboard
              </Button>
            ) : null}
            
            <Chip 
              label={`Welcome, ${user?.username || 'User'}`}
              sx={{ 
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 'bold',
                '& .MuiChip-label': { 
                  px: 2,
                  py: 0.5
                }
              }}
            />
            
            <Button 
              color="inherit" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        ) : (
          // Logged out navigation
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/login"
            >
              Login
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/register"
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 