import { styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

export const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
  padding: theme.spacing(4, 0),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: 'radial-gradient(circle at top right, rgba(74, 144, 226, 0.1) 0%, transparent 60%)',
    pointerEvents: 'none'
  }
}));

export const ContentPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)'
  }
})); 