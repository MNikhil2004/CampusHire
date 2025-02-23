import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  InputAdornment,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Search and filter states
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    minSalary: '',
    year: '',
    sortBy: 'latest'
  });

  // Handle input changes
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get(`/api/jobs/college/${user.college}`);
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    if (user?.college && user.role === 'user') {
      fetchJobs();
    }
  }, [user?.college, user?.role]);

  // Filter and sort jobs based on search parameters
  useEffect(() => {
    let result = [...jobs];

    // Keyword filter (company name or role)
    if (searchParams.keyword) {
      const keyword = searchParams.keyword.toLowerCase();
      result = result.filter(job => 
        job.companyName.toLowerCase().includes(keyword) ||
        job.role.toLowerCase().includes(keyword)
      );
    }

    // Salary filter
    if (searchParams.minSalary) {
      result = result.filter(job => 
        parseFloat(job.salary) >= parseFloat(searchParams.minSalary)
      );
    }

    // Year filter
    if (searchParams.year) {
      result = result.filter(job => 
        job.yearOfJoining === parseInt(searchParams.year)
      );
    }

    // Sorting
    switch (searchParams.sortBy) {
      case 'salary-high':
        result.sort((a, b) => parseFloat(b.salary) - parseFloat(a.salary));
        break;
      case 'salary-low':
        result.sort((a, b) => parseFloat(a.salary) - parseFloat(b.salary));
        break;
      case 'year-new':
        result.sort((a, b) => b.yearOfJoining - a.yearOfJoining);
        break;
      case 'year-old':
        result.sort((a, b) => a.yearOfJoining - b.yearOfJoining);
        break;
      case 'latest':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredJobs(result);
  }, [searchParams, jobs]);

  const JobHolderHome = () => (
    <Box sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Help Your Juniors Succeed
        </Typography>
        <Typography variant="body1" paragraph>
          Share your valuable experience and help guide the next generation of professionals.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/jobholder/dashboard')}
          sx={{ mt: 2 }}
        >
          Open Dashboard
        </Button>
      </Paper>

      <Grid container spacing={4}>
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
                onClick={() => navigate('/jobholder/dashboard')}
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
                Post New Job Openings
              </Typography>
              <Typography variant="body1" paragraph>
                Let others know about opportunities at your company.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/jobholder/dashboard')}
              >
                Post a Job
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const StudentHome = () => (
    <Box sx={{ py: 4 }}>
      {/* Search and Filter Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Jobs"
              name="keyword"
              value={searchParams.keyword}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Search by company or role"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Minimum Salary"
              name="minSalary"
              type="number"
              value={searchParams.minSalary}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Filter by Year"
              name="year"
              type="number"
              value={searchParams.year}
              onChange={handleSearchChange}
              inputProps={{ 
                min: "2000",
                max: new Date().getFullYear(),
                placeholder: "YYYY"
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                name="sortBy"
                value={searchParams.sortBy}
                label="Sort By"
                onChange={handleSearchChange}
              >
                <MenuItem value="latest">Latest First</MenuItem>
                <MenuItem value="salary-high">Highest Salary</MenuItem>
                <MenuItem value="salary-low">Lowest Salary</MenuItem>
                <MenuItem value="year-new">Recent Joinings</MenuItem>
                <MenuItem value="year-old">Older Joinings</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Section */}
      <Typography variant="h4" gutterBottom>
        Latest Jobs in {user?.college}
      </Typography>
      
      {filteredJobs.length === 0 ? (
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No jobs found matching your criteria
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} md={6} lg={4} key={job._id}>
              <Card>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  {job.companyImage && (
                    <CardMedia
                      component="img"
                      sx={{ width: 50, height: 50, objectFit: 'contain', mr: 2 }}
                      image={`${process.env.REACT_APP_API_URL}/${job.companyImage}`}
                      alt={job.companyName}
                    />
                  )}
                  <Typography variant="h6">
                    {job.companyName}
                  </Typography>
                </Box>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Role: {job.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Salary: ₹{job.salary}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Year of Joining: {job.yearOfJoining}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Contact: {job.postedBy?.email}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/job/${job._id}/questions`)}
                    >
                      Check Questions
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/job/${job._id}`)}
                    >
                      Check Description
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/job/${job._id}/reviews`)}
                    >
                      Check Reviews
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  return (
    <Container>
      {user?.role === 'jobholder' ? <JobHolderHome /> : <StudentHome />}
    </Container>
  );
};

export default Home; 