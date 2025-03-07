import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            cursor: 'pointer',
            color: '#2C3E50',
            fontWeight: 600 
          }}
          onClick={() => navigate('/')}
        >
          Job Portal
        </Typography>
        
        <div>
          {currentUser ? (
            <>
              <Button 
                color="inherit" 
                onClick={() => navigate('/jobholder/dashboard')}
                sx={{ color: '#2C3E50' }}
              >
                Dashboard
              </Button>
              <Button 
                color="inherit" 
                onClick={handleLogout}
                sx={{ color: '#2C3E50' }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')}
                sx={{ color: '#2C3E50' }}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/register')}
                sx={{ color: '#2C3E50' }}
              >
                Register
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 