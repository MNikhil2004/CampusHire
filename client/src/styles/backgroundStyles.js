import { styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

export const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
    : 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
  padding: theme.spacing(4, 0),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle at top right, rgba(144, 202, 249, 0.1) 0%, transparent 60%)'
      : 'radial-gradient(circle at top right, rgba(74, 144, 226, 0.1) 0%, transparent 60%)',
    pointerEvents: 'none'
  }
}));

export const ContentPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(30, 30, 30, 0.9)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 48px rgba(0, 0, 0, 0.4)'
      : '0 12px 48px rgba(0, 0, 0, 0.12)'
  }
})); 