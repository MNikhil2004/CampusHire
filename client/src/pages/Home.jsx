import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  Box,
  Divider
} from '@mui/material';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsQuery = query(collection(db, 'jobs'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(jobsQuery);
        const jobsList = [];
        
        for (const docSnapshot of querySnapshot.docs) {
          const jobData = docSnapshot.data();
          let posterEmail = '';
          
          // Fetch poster's email if postedBy exists
          if (jobData.postedBy) {
            const userDocRef = doc(db, 'users', jobData.postedBy);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              posterEmail = userDocSnap.data().email;
            }
          }
          
          jobsList.push({
            id: docSnapshot.id,
            ...jobData,
            posterEmail
          });
        }
        
        setJobs(jobsList);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <Card 
              elevation={0} 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                border: '1px solid rgba(0, 0, 0, 0.12)',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {job.companyName}
                </Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {job.jobRole}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  ₹{job.salary}
                </Typography>
                
                {job.posterEmail && (
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      backgroundColor: 'rgba(74, 144, 226, 0.1)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      marginBottom: '16px',
                      marginTop: 'auto'
                    }}
                  >
                    <EmailIcon sx={{ color: '#4A90E2', fontSize: '1rem' }} />
                    <Typography 
                      sx={{ 
                        fontStyle: 'italic',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: '#2C3E50',
                        letterSpacing: '0.2px',
                        fontFamily: '"Poppins", sans-serif'
                      }}
                    >
                      Contact: {job.posterEmail}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => navigate(`/job/${job.id}/questions`)}
                  >
                    View Questions
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={() => navigate(`/job/${job.id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="text"
                    color="primary"
                    fullWidth
                    onClick={() => navigate(`/job/${job.id}/reviews`)}
                  >
                    Read Reviews
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 