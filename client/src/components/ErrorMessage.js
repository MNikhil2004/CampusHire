import { Alert } from '@mui/material';

const ErrorMessage = ({ error }) => {
  if (!error) return null;
  
  return (
    <Alert severity="error" sx={{ mt: 2 }}>
      {error.response?.data?.message || error.message || 'An error occurred'}
    </Alert>
  );
};

export default ErrorMessage; 