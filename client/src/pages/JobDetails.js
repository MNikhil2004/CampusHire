import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardMedia,
  Divider
} from '@mui/material';
import axios from 'axios';

const JobDetails = () => {
  const [job, setJob] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJob();
  }, [id]);

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {job.companyImage && (
          <Card sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              height="200"
              image={`http://localhost:5000/${job.companyImage}`}
              alt={job.companyName}
            />
          </Card>
        )}
        
        <Typography variant="h4" gutterBottom>
          {job.companyName}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Role Details
          </Typography>
          <Typography variant="body1">
            Position: {job.role}
          </Typography>
          <Typography variant="body1">
            Salary: ₹{job.salary}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box>
          <Typography variant="h6" gutterBottom>
            Job Description
          </Typography>
          <Typography variant="body1">
            {job.description}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default JobDetails; 