import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import api from '../utils/axios';

const AdminDashboard = () => {
  const [value, setValue] = useState(0);
  const [pendingJobHolders, setPendingJobHolders] = useState([]);
  const [verifiedJobHolders, setVerifiedJobHolders] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchJobs();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');
      setPendingJobHolders(response.data.filter(user => 
        user.role === 'jobholder' && !user.isVerified
      ));
      setVerifiedJobHolders(response.data.filter(user => 
        user.role === 'jobholder' && user.isVerified
      ));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await api.get('/api/admin/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleVerify = async (userId) => {
    try {
      await api.post(`/api/admin/verify/${userId}`, credentials);
      setDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  const handleRemoveJob = async (jobId) => {
    if (window.confirm('Are you sure you want to remove this job?')) {
      try {
        await api.delete(`/api/admin/jobs/${jobId}`);
        fetchJobs();
      } catch (error) {
        console.error('Error removing job:', error);
      }
    }
  };

  const handleRemoveVerification = async (userId) => {
    if (window.confirm('Are you sure you want to remove verification from this job holder?')) {
      try {
        await api.post(`/api/admin/remove-verification/${userId}`);
        fetchUsers(); // Refresh the users list
      } catch (error) {
        console.error('Error removing verification:', error);
      }
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={value} onChange={(e, newValue) => setValue(newValue)}>
            <Tab label="Pending Verifications" />
            <Tab label="Verified Job Holders" />
            <Tab label="Manage Jobs" />
          </Tabs>
        </Box>

        {/* Pending Verifications Tab */}
        <Box role="tabpanel" hidden={value !== 0}>
          {value === 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingJobHolders.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.jobDetails?.companyName}</TableCell>
                    <TableCell>{user.jobDetails?.role}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setSelectedUser(user);
                          setDialogOpen(true);
                        }}
                      >
                        Verify
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>

        {/* Verified Job Holders Tab */}
        <Box role="tabpanel" hidden={value !== 1}>
          {value === 1 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {verifiedJobHolders.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.jobDetails?.companyName}</TableCell>
                    <TableCell>{user.jobDetails?.role}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleRemoveVerification(user._id)}
                      >
                        Remove Verification
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>

        {/* Manage Jobs Tab */}
        <Box role="tabpanel" hidden={value !== 2}>
          {value === 2 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Posted By</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell>{job.companyName}</TableCell>
                    <TableCell>{job.role}</TableCell>
                    <TableCell>{job.postedBy.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleRemoveJob(job._id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>

        {/* Verification Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Verify Job Holder</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Set Username"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              sx={{ mb: 2, mt: 2 }}
            />
            <TextField
              fullWidth
              label="Set Password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => handleVerify(selectedUser._id)}
              variant="contained"
            >
              Verify & Create Account
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default AdminDashboard; 