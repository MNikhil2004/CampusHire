import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Chip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4A90E2 0%, #67B26F 100%)',
  boxShadow: 'none',
  '& .MuiToolbar-root': {
    padding: theme.spacing(1, 3)
  }
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: 'white',
  borderRadius: 20,
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)'
  }
}));

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <StyledAppBar position="static">
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
              // Remove this section for student navigation
              null
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
    </StyledAppBar>
  );
};

export default Navbar; 