import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Card,
  CardContent,
  Chip,
  Stack
} from '@mui/material';
import api from '../utils/axios';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: jobId } = useParams();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/api/reviews/job/${jobId}`);
        setReviews(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews. Please try again later.');
        setLoading(false);
      }
    };

    fetchReviews();
  }, [jobId]);

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Loading reviews...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Interview Reviews
        </Typography>

        {reviews.length === 0 ? (
          <Typography>No reviews available for this job yet.</Typography>
        ) : (
          <Stack spacing={3}>
            {reviews.map((review, index) => (
              <Card key={review._id} variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Review #{index + 1}
                  </Typography>
                  
                  {review.rounds.map((round, roundIndex) => (
                    <Box key={roundIndex} sx={{ mb: 2 }}>
                      <Chip 
                        label={`Round ${round.roundNumber}`}
                        color="primary"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body1">
                        {round.experience}
                      </Typography>
                      {roundIndex < review.rounds.length - 1 && (
                        <Divider sx={{ my: 1 }} />
                      )}
                    </Box>
                  ))}

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      Overall Experience
                    </Typography>
                    <Typography variant="body1">
                      {review.overallExperience}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Paper>
    </Container>
  );
};

export default Reviews; 