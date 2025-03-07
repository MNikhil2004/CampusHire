import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box, 
  Divider,
  Chip,
  Link
} from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import EmailIcon from '@mui/icons-material/Email';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const { currentUser } = useAuth();
  const [posterEmail, setPosterEmail] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobDoc = await getDoc(doc(db, 'jobs', id));
        if (jobDoc.exists()) {
          const jobData = jobDoc.data();
          setJob({ id: jobDoc.id, ...jobData });
          // Get the poster's email
          if (jobData.postedBy) {
            const userDoc = await getDoc(doc(db, 'users', jobData.postedBy));
            if (userDoc.exists()) {
              setPosterEmail(userDoc.data().email);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };
    fetchJobDetails();
  }, [id]);

  if (!job) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          {job.jobRole}
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          {job.companyName}
        </Typography>
        
        <Box sx={{ my: 3 }}>
          <Typography variant="body1" paragraph>
            {job.jobDescription}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Contact Information */}
        <Box sx={{ my: 3 }}>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 2 }}>
            <EmailIcon color="primary" />
            <Link 
              href={`mailto:${posterEmail}`}
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {posterEmail}
            </Link>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
          {/* Elegant Email Display */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              backgroundColor: 'rgba(74, 144, 226, 0.1)',
              padding: '12px 20px',
              borderRadius: '8px',
              marginBottom: '8px'
            }}
          >
            <EmailIcon sx={{ color: '#4A90E2' }} />
            <Typography 
              sx={{ 
                fontStyle: 'italic',
                fontWeight: 600,
                color: '#2C3E50',
                letterSpacing: '0.3px',
                fontFamily: '"Poppins", sans-serif',
                '&:hover': {
                  color: '#4A90E2'
                }
              }}
            >
              {posterEmail}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/job/${id}/questions`)}
            fullWidth
          >
            View Questions
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/job/${id}/reviews`)}
            fullWidth
          >
            View Reviews
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default JobDetails; 