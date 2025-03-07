import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import api from '../utils/axios';
import { PageContainer } from '../styles/backgroundStyles';

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    companyName: '',
    role: '',
    salary: '',
    description: '',
    yearOfJoining: ''
  });
  const [tabValue, setTabValue] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const [jobRes, questionsRes, reviewsRes] = await Promise.all([
          api.get(`/api/jobs/${jobId}`),
          api.get(`/api/questions/job/${jobId}`),
          api.get(`/api/reviews/job/${jobId}`)
        ]);
        setJobData(jobRes.data);
        setQuestions(questionsRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchJobData();
  }, [jobId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleQuestionDelete = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await api.delete(`/api/questions/${questionId}`);
        setQuestions(questions.filter(q => q._id !== questionId));
        alert('Question deleted successfully!');
      } catch (error) {
        alert('Error deleting question');
      }
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/api/reviews/${reviewId}`);
        setReviews(reviews.filter(r => r._id !== reviewId));
        alert('Review deleted successfully!');
      } catch (error) {
        alert('Error deleting review');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/jobs/${jobId}`, {
        description: jobData.description
      });
      alert('Job details updated successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Error updating job details');
    }
  };

  return (
    <PageContainer>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom color="primary.main">
            Edit Job Details
          </Typography>

          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Job Description" />
            <Tab label="Questions" />
            <Tab label="Reviews" />
          </Tabs>

          {/* Job Description Tab */}
          {tabValue === 0 && (
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={jobData.companyName}
                    onChange={(e) => setJobData({ ...jobData, companyName: e.target.value })}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Role"
                    value={jobData.role}
                    onChange={(e) => setJobData({ ...jobData, role: e.target.value })}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Salary (LPA)"
                    value={jobData.salary}
                    onChange={(e) => setJobData({ ...jobData, salary: e.target.value })}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Year of Joining"
                    value={jobData.yearOfJoining}
                    onChange={(e) => setJobData({ ...jobData, yearOfJoining: e.target.value })}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    value={jobData.description}
                    onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outlined" 
                      onClick={() => navigate('/')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="contained"
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Questions Tab */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Interview Questions
              </Typography>
              {questions.length === 0 ? (
                <Typography color="text.secondary">No questions added yet.</Typography>
              ) : (
                questions.map((question, index) => (
                  <Paper 
                    key={question._id} 
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      backgroundColor: 'background.default' 
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      Question {index + 1}: {question.question}
                    </Typography>
                    {question.answer && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Answer: {question.answer}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Type: {question.type}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleQuestionDelete(question._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Paper>
                ))
              )}
            </Box>
          )}

          {/* Reviews Tab */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Interview Reviews
              </Typography>
              {reviews.length === 0 ? (
                <Typography color="text.secondary">No reviews added yet.</Typography>
              ) : (
                reviews.map((review, index) => (
                  <Paper 
                    key={review._id} 
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      backgroundColor: 'background.default' 
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      Review {index + 1}
                    </Typography>
                    {review.rounds.map((round, idx) => (
                      <Box key={idx} sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Round {round.roundNumber}:
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {round.experience}
                        </Typography>
                      </Box>
                    ))}
                    <Typography variant="body2" paragraph>
                      Overall Experience:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {review.overallExperience}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleReviewDelete(review._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Paper>
                ))
              )}
            </Box>
          )}

          {/* Bottom Navigation */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </Box>
        </Paper>
      </Container>
    </PageContainer>
  );
};

export default EditJob; 