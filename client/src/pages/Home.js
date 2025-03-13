//Home page for both jobholder and student
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { styled } from '@mui/material/styles';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { PageContainer, ContentPaper } from '../styles/backgroundStyles';
import '../styles/Home.css';
import EmailIcon from '@mui/icons-material/Email';

const JobCard = styled(Card)(({ theme }) => ({
  
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  borderRadius: 16,
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
  }
}));


const JobCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  '& .MuiTypography-h6': {
    color: theme.palette.primary.main,
    fontWeight: 600
  },
  '& .MuiTypography-subtitle1': {
    color: theme.palette.secondary.main,
    fontWeight: 500
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({

  marginTop: theme.spacing(1),
  width: '100%',
  borderRadius: 8,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  }
}));

const InsightsCard = styled(Card)(({ theme }) => ({
  
  height: '100%',
  backgroundColor: ' #f5f7fa;',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(3, 2, 2, 0.12)'
  }
}));

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const { user } = useAuth();
  const [value, setValue] = useState(0);
  const navigate = useNavigate();


  // Search and filter states
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    minSalary: '',
    year: '',
    sortBy: 'latest'
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (user?.role === 'jobholder') {
          const response = await api.get('/api/jobs/myjobs');
          setJobs(response.data);
        } else if (user?.college && user?.role === 'user') {
          const response = await api.get(`/api/jobs/college/${user.college}`);
          setJobs(response.data);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    if (user) {
      fetchJobs();
    }
  }, [user]);

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

  const JobHolderHome = () => (
    <Box sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary.main">
          Make a Difference in Your College Community
        </Typography>
        <Typography variant="body1" paragraph>
          As an alumnus, you can help current students by:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Share Opportunities
              </Typography>
              <Typography>
                Post Your Job
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Guide Others
              </Typography>
              <Typography>
                Share interview questions and experiences
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Build Network
              </Typography>
              <Typography>
                Connect with and mentor juniors
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Add Questions & Reviews
              </Typography>
              <Typography variant="body1" paragraph>
                Share interview questions and your interview experience to help others prepare better.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setValue(0);
                  navigate('/jobholder/dashboard?tab=1');
                }}  
              >
                Start Contributing
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
           <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Post Your Jobs  
              </Typography>
              <Typography variant="body1" paragraph>
                Let others know about opportunities at your company.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setValue(0);
                  navigate('/jobholder/dashboard?tab=0');
                }}  
              >
                Post a Job
              </Button>
            </CardContent>
          </Card> 
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom color="primary.main">
          Your Shared Jobs
        </Typography>
        <Grid container spacing={3}>
          {jobs.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                You haven't shared any job opportunities yet.
              </Typography>
            </Grid>
          ) : (
            jobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
                <InsightsCard>
                  <CardContent>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      height: 60 
                    }}>
                      {job.companyImage && (
                        <Box
                          component="img"
                          src={`${process.env.REACT_APP_API_URL}/${job.companyImage}`}
                          alt={job.companyName}
                          sx={{
                            height: 50,
                            width: 50,
                            objectFit: 'contain',
                            mr: 2
                          }}
                        />
                      )}
                      <Typography variant="h6" noWrap>
                        {job.companyName}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      {job.role}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        ₹{job.salary} 
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Year: {job.yearOfJoining}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: 60
                      }}
                    >
                      {job.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        onClick={() => navigate(`/job/${job._id}/edit`)}
                      >
                        Edit Details
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={() => handleDeleteJob(job._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </InsightsCard>
              </Grid>
            ))
          )}
        </Grid>
      </Paper>
    </Box>
  );

  const StudentHome = () => (
    <Box className="container" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary.main">
          Welcome to Your Job Search Journey
        </Typography>
        <Typography variant="body1" paragraph>
          Here you can:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Find Jobs
              </Typography>
              <Typography>
                Browse opportunities posted by alumni from your college
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Prepare Better
              </Typography>
              <Typography>
                Access real interview questions and experiences
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Get Insights
              </Typography>
              <Typography>
                Learn from detailed interview reviews and tips
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h4" gutterBottom>
        Latest Jobs in {user?.college}
      </Typography>
      
      {jobs.length === 0 ? (
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No jobs found.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {jobs.map((job) => (
            <Grid item xs={12} md={6} lg={4} key={job._id}>
              <JobCard> 
                <JobCardContent>
                  {job.companyImage && (  
                    <Box 
                      component="img"
                      src={`${process.env.REACT_APP_API_URL}/${job.companyImage}`}
                      alt={job.companyName}
                      sx={{ 
                        height: 60,
                        objectFit: 'contain',
                        mb: 2,
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                      }}
                    />
                  )}
                  <Typography variant="h6" gutterBottom>
                    {job.companyName}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {job.role}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    mb: 2,
                    color: 'text.secondary',
                    fontSize: '0.875rem'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        ₹{job.salary}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarTodayIcon fontSize="small" />
                      {job.yearOfJoining}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EmailIcon fontSize="small" color="primary" />  {/* Email Icon */}
                      {job.postedBy?.email ? job.postedBy.email : 'Unknown'}  {/* Display email */}
                    </Box>
                  </Box>
                  <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <ActionButton
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(`/job/${job._id}/questions`)}
                    >
                      View Questions
                    </ActionButton>
                    <ActionButton
                      variant="contained"
                      onClick={() => navigate(`/job/${job._id}`)}
                    >
                      View Details
                    </ActionButton>
                    <ActionButton
                      variant="outlined"
                      color="secondary"
                      onClick={() => navigate(`/job/${job._id}/reviews`)}
                    >
                      Read Reviews
                    </ActionButton>
                  </Box>
                </JobCardContent>
              </JobCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  const PublicHome = () => (
    <Box className="container" sx={{ py: 8 }}>
      <Container>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
          Welcome to CareerBridge
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
          Connecting College Students with Alumni Job Opportunities
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <Typography variant="h6" color="primary.main" gutterBottom>
                Real Interview Insights
              </Typography>
              <Typography variant="body1">
                Access actual interview questions and experiences shared by alumni who got placed.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <Typography variant="h6" color="primary.main" gutterBottom>
                College-Specific Jobs
              </Typography>
              <Typography variant="body1">
                Find job opportunities posted by alumni from your own college.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <Typography variant="h6" color="primary.main" gutterBottom>
                Direct Alumni Connect
              </Typography>
              <Typography variant="body1">
                Learn from and connect with successful alumni from your college.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" gutterBottom color="primary.main">
                For Students
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" paragraph>
                  • Access job opportunities from your college alumni
                </Typography>
                <Typography variant="body1" paragraph>
                  • Get real interview questions and experiences
                </Typography>
                <Typography variant="body1" paragraph>
                  • Learn from alumni success stories
                </Typography>
                <Typography variant="body1" paragraph>
                  • Prepare with company-specific interview guides
                </Typography>
                <Typography variant="body1" paragraph>
                  • Track your application progress
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                component={Link} 
                to="/login"
                size="large"
                fullWidth
              >
                Login to Access Jobs
              </Button>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 2, textAlign: 'center' }}
              >
                Join your college network to access all features
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" gutterBottom color="primary.main">
                For Job Holders
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" paragraph>
                  • Share job opportunities from your company
                </Typography>
                <Typography variant="body1" paragraph>
                  • Help juniors with interview preparation
                </Typography>
                <Typography variant="body1" paragraph>
                  • Give back to your college community
                </Typography>
                <Typography variant="body1" paragraph>
                  • Build your professional network
                </Typography>
                <Typography variant="body1" paragraph>
                  • Track the impact of your contributions
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                component={Link} 
                to="/register"
                size="large"
                fullWidth
              >
                Register as Job Holder
              </Button>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 2, textAlign: 'center' }}
              >
                Help shape the future of your juniors
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper 
          sx={{ 
            mt: 6, 
            p: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #4A90E2 0%, #67B26F 100%)',
            color: 'white'
          }}
        >
          <Typography variant="h5" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Join CareerBridge to access all features and connect with your college network
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              component={Link} 
              to="/login"
              size="large"
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}
            >
              Login Now
            </Button>
            <Button 
              variant="outlined" 
              component={Link} 
              to="/register"
              size="large"
              sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Register
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );

  return (
    <PageContainer>
      <Container>
        {!user ? <PublicHome /> : 
          user.role === 'jobholder' ? <JobHolderHome /> : <StudentHome />}
      </Container>
    </PageContainer>
  );
};

export default Home; 