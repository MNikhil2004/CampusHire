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
  CardMedia
} from '@mui/material';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const JobHolderDashboard = () => {
  const [value, setValue] = useState(0);
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
        const response = await api.get(`/api/jobs/college/${user.college}`);
        setJobs(response.data);
        if (response.data.length > 0) {
          setSelectedJobId(response.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, [user.college]);

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
      const response = await api.get(`/api/jobs/college/${user.college}`);
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
        const response = await api.get(`/api/jobs/college/${user.college}`);
        setJobs(response.data);
        
        alert('Job deleted successfully!');
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Error deleting job');
      }
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Job Holder Dashboard
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={value} onChange={handleTabChange}>
            <Tab label="Add Job" />
            <Tab label="My Jobs" />
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
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({...jobForm, salary: e.target.value})}
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

        {/* My Jobs */}
        <Box role="tabpanel" hidden={value !== 1}>
          {value === 1 && (
            <Grid container spacing={3}>
              {jobs.length === 0 ? (
                <Grid item xs={12}>
                  <Typography>You haven't posted any jobs yet.</Typography>
                </Grid>
              ) : (
                jobs.map((job) => (
                  <Grid item xs={12} md={6} key={job._id}>
                    <Card>
                      <CardContent>
                        {editingJob === job._id ? (
                          // Edit Form
                          <form onSubmit={(e) => handleUpdateJob(e, job._id)}>
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
                                  value={jobForm.salary}
                                  onChange={(e) => setJobForm({...jobForm, salary: e.target.value})}
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
                                  inputProps={{ min: "2000", max: new Date().getFullYear() }}
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
                              <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                                <Button type="submit" variant="contained" color="primary">
                                  Save Changes
                                </Button>
                                <Button 
                                  variant="outlined" 
                                  onClick={() => {
                                    setEditingJob(null);
                                    setJobForm({
                                      companyName: '',
                                      role: '',
                                      salary: '',
                                      description: '',
                                      companyImage: null,
                                      yearOfJoining: ''
                                    });
                                  }}
                                >
                                  Cancel
                                </Button>
                              </Grid>
                            </Grid>
                          </form>
                        ) : (
                          // Display Job
                          <>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              {job.companyImage && (
                                <CardMedia
                                  component="img"
                                  sx={{ width: 50, height: 50, objectFit: 'contain', mr: 2 }}
                                  image={`${process.env.REACT_APP_API_URL}/${job.companyImage}`}
                                  alt={job.companyName}
                                />
                              )}
                              <Typography variant="h6">{job.companyName}</Typography>
                            </Box>
                            <Typography variant="subtitle1" gutterBottom>Role: {job.role}</Typography>
                            <Typography variant="body2" gutterBottom>Salary: ₹{job.salary}</Typography>
                            <Typography variant="body2" gutterBottom>Year: {job.yearOfJoining}</Typography>
                            <Typography variant="body2" paragraph>Description: {job.description}</Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Button 
                                variant="contained" 
                                color="primary"
                                onClick={() => {
                                  setEditingJob(job._id);
                                  setJobForm({
                                    companyName: job.companyName,
                                    role: job.role,
                                    salary: job.salary,
                                    description: job.description,
                                    yearOfJoining: job.yearOfJoining,
                                    companyImage: null
                                  });
                                }}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="contained" 
                                color="error"
                                onClick={() => handleDeleteJob(job._id)}
                              >
                                Delete
                              </Button>
                            </Box>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </Box>

        {/* Add Questions Form */}
        <Box role="tabpanel" hidden={value !== 2}>
          {value === 2 && (
            <form onSubmit={handleQuestionSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
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
                  </TextField>
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
        <Box role="tabpanel" hidden={value !== 3}>
          {value === 3 && (
            <form onSubmit={handleReviewSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
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
                  </TextField>
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
      </Paper>
    </Container>
  );
};

export default JobHolderDashboard; 