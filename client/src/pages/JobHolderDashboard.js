import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Select
} from '@mui/material';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { PageContainer, ContentPaper } from '../styles/backgroundStyles';
import { styled } from '@mui/material/styles';

const InsightsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)'
  }
}));

const JobHolderDashboard = () => {
  // Get tab from URL query parameter, default to 1 (My Jobs)
  const searchParams = new URLSearchParams(window.location.search);
  const initialTab = parseInt(searchParams.get('tab')) || 1;
  
  const [value, setValue] = useState(initialTab);
  const [jobForm, setJobForm] = useState({
    companyName: '',
    role: '',
    salary: '',
    description: '',
    companyImage: null,
    yearOfJoining: ''
  });
  const [questionForm, setQuestionForm] = useState({
    type: 'technical',
    question: '',
    answer: ''
  });
  const [reviewForm, setReviewForm] = useState({
    rounds: [{ roundNumber: 1, experience: '' }],
    overallExperience: ''
  });
  const { user } = useAuth();
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Fetch user's jobs when component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Use the myjobs endpoint instead
        const response = await api.get('/api/jobs/myjobs');
        setJobs(response.data);
        if (response.data.length > 0) {
          setSelectedJobId(response.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(jobForm).forEach(key => {
        formData.append(key, jobForm[key]);
      });
      formData.append('college', user.college);

      await api.post('/api/jobs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setJobForm({
        companyName: '',
        role: '',
        salary: '',
        description: '',
        companyImage: null,
        yearOfJoining: ''
      });
      alert('Job posted successfully!');
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Error posting job');
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/questions', {
        ...questionForm,
        jobId: selectedJobId
      });
      setQuestionForm({
        type: 'technical',
        question: '',
        answer: ''
      });
      alert('Question added successfully!');
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Error adding question');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/reviews', {
        ...reviewForm,
        jobId: selectedJobId
      });
      setReviewForm({
        rounds: [{ roundNumber: 1, experience: '' }],
        overallExperience: ''
      });
      alert('Review added successfully!');
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Error adding review');
    }
  };

  const handleUpdateJob = async (e, jobId) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(jobForm).forEach(key => {
        if (jobForm[key] !== null) {
          formData.append(key, jobForm[key]);
        }
      });
      formData.append('college', user.college);

      await api.put(`/api/jobs/${jobId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Refresh jobs list
      const response = await api.get('/api/jobs/myjobs');
      setJobs(response.data);
      
      setEditingJob(null);
      setJobForm({
        companyName: '',
        role: '',
        salary: '',
        description: '',
        companyImage: null,
        yearOfJoining: ''
      });
      alert('Job updated successfully!');
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Error updating job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/api/jobs/${jobId}`);
        
        // Refresh jobs list
        const response = await api.get('/api/jobs/myjobs');
        setJobs(response.data);
        
        alert('Job deleted successfully!');
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Error deleting job');
      }
    }
  };

  const handleJobFormChange = (e) => {
    const { name, value } = e.target;
    setJobForm({ ...jobForm, [name]: value });
  };

  return (
    <PageContainer>
      <Container sx={{ py: 4 }}>
        <ContentPaper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Job Holder Dashboard
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={value} onChange={handleTabChange}>
              <Tab label="Add Job" />
              <Tab label="Add Questions" />
              <Tab label="Add Review" />
            </Tabs>
          </Box>

          {/* Add Job Form */}
          <Box role="tabpanel" hidden={value !== 0}>
            {value === 0 && (
              <form onSubmit={handleJobSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      value={jobForm.companyName}
                      onChange={(e) => setJobForm({...jobForm, companyName: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Role"
                      value={jobForm.role}
                      onChange={(e) => setJobForm({...jobForm, role: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Salary"
                      name="salary"
                      value={jobForm.salary}
                      onChange={handleJobFormChange}
                      placeholder="Enter CTC in LPA (e.g., 12.5)"
                      helperText="Please enter the total CTC in Lakhs Per Annum"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Year of Joining"
                      type="number"
                      value={jobForm.yearOfJoining}
                      onChange={(e) => setJobForm({...jobForm, yearOfJoining: e.target.value})}
                      required
                      inputProps={{ 
                        min: "2000",
                        max: new Date().getFullYear(),
                        placeholder: "YYYY"
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Description"
                      value={jobForm.description}
                      onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setJobForm({...jobForm, companyImage: e.target.files[0]})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      type="submit" 
                      variant="contained"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Posting...' : 'Post Job'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Box>

          {/* Add Questions Form */}
          <Box role="tabpanel" hidden={value !== 1}>
            {value === 1 && (
              <form onSubmit={handleQuestionSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Select
                      fullWidth
                      label="Select Job"
                      value={selectedJobId || ''}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      required
                    >
                      {jobs.map((job) => (
                        <MenuItem key={job._id} value={job._id}>
                          {job.companyName} - {job.role}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Question Type"
                      value={questionForm.type}
                      onChange={(e) => setQuestionForm({...questionForm, type: e.target.value})}
                      required
                    >
                      <MenuItem value="technical">Technical</MenuItem>
                      <MenuItem value="non-technical">Non-Technical</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Question"
                      value={questionForm.question}
                      onChange={(e) => setQuestionForm({...questionForm, question: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Answer (Optional)"
                      value={questionForm.answer}
                      onChange={(e) => setQuestionForm({...questionForm, answer: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained">
                      Add Question
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Box>

          {/* Add Review Form */}
          <Box role="tabpanel" hidden={value !== 2}>
            {value === 2 && (
              <form onSubmit={handleReviewSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Select
                      fullWidth
                      label="Select Job"
                      value={selectedJobId || ''}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      required
                    >
                      {jobs.map((job) => (
                        <MenuItem key={job._id} value={job._id}>
                          {job.companyName} - {job.role}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  {reviewForm.rounds.map((round, index) => (
                    <Grid item xs={12} key={index}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label={`Round ${round.roundNumber} Experience`}
                        value={round.experience}
                        onChange={(e) => {
                          const newRounds = [...reviewForm.rounds];
                          newRounds[index].experience = e.target.value;
                          setReviewForm({...reviewForm, rounds: newRounds});
                        }}
                        required
                      />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => setReviewForm({
                        ...reviewForm,
                        rounds: [...reviewForm.rounds, { roundNumber: reviewForm.rounds.length + 1, experience: '' }]
                      })}
                    >
                      Add Round
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Overall Experience"
                      value={reviewForm.overallExperience}
                      onChange={(e) => setReviewForm({...reviewForm, overallExperience: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained">
                      Add Review
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Box>
        </ContentPaper>
      </Container>
    </PageContainer>
  );
};

export default JobHolderDashboard; 