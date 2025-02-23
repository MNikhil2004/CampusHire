import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { styled } from '@mui/material/styles';

const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/images/login-bg.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.1,
    pointerEvents: 'none'
  }
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  maxWidth: 400,
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  '& .MuiTextField-root': {
    marginBottom: theme.spacing(2)
  }
}));

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      login(response.data);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <LoginContainer>
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4, 
        maxWidth: 600,
        px: 2,
        position: 'relative',
        zIndex: 1
      }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          Unlock Your Career Opportunities
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
          Connect with your college alumni network and access exclusive job opportunities
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Get insights about interview experiences, salary trends, and career growth paths from your seniors
        </Typography>
      </Box>

      <LoginCard elevation={0}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account yet?
            </Typography>
            <Button
              component={Link}
              to="/register"
              color="primary"
              sx={{ mt: 1 }}
            >
              Register Now to Join Your College Network
            </Button>
          </Box>
        </Box>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 