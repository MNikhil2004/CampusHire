// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Paper,
//   Typography,
//   Box,
//   Tabs,
//   Tab,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   IconButton,
//   Tooltip
// } from '@mui/material';
// import {
//   Visibility as VisibilityIcon,
//   Delete as DeleteIcon,
//   Check as CheckIcon
// } from '@mui/icons-material';
// import api from '../utils/axios';

// const AdminDashboard = () => {
//   const [tabValue, setTabValue] = useState(0);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [verifiedUsers, setVerifiedUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [credentialsDialog, setCredentialsDialog] = useState(false);
//   const [credentials, setCredentials] = useState({
//     username: '',
//     password: ''
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [pendingRes, verifiedRes] = await Promise.all([
//         api.get('/api/admin/pending-requests'),
//         api.get('/api/admin/verified-jobholders')
//       ]);
//       setPendingRequests(pendingRes.data);
//       setVerifiedUsers(verifiedRes.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleVerify = async () => {
//     try {
//       await api.post(`/api/admin/verify-jobholder/${selectedUser._id}`, credentials);
//       setCredentialsDialog(false);
//       fetchData();
//     } catch (error) {
//       console.error('Error verifying user:', error);
//     }
//   };

//   const handleRemoveVerification = async (userId) => {
//     if (window.confirm('Are you sure you want to remove this verification?')) {
//       try {
//         await api.post(`/api/admin/remove-verification/${userId}`);
//         fetchData();
//       } catch (error) {
//         console.error('Error removing verification:', error);
//       }
//     }
//   };

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Paper elevation={3} sx={{ p: 3 }}>
//         <Typography variant="h4" gutterBottom>
//           Admin Dashboard
//         </Typography>

//         <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
//           <Tab label="Pending Requests" />
//           <Tab label="Verified Job Holders" />
//         </Tabs>

//         {/* Pending Requests Tab */}
//         <TabPanel value={tabValue} index={0}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Company</TableCell>
//                 <TableCell>Role</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {pendingRequests.map((request) => (
//                 <TableRow key={request._id}>
//                   <TableCell>{request.email}</TableCell>
//                   <TableCell>{request.jobDetails?.companyName}</TableCell>
//                   <TableCell>{request.jobDetails?.role}</TableCell>
//                   <TableCell>
//                     <Tooltip title="View Offer Letter">
//                       <IconButton onClick={() => window.open(`/uploads/offerLetters/${request.jobDetails.offerLetter}`)}>
//                         <VisibilityIcon />
//                       </IconButton>
//                     </Tooltip>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       startIcon={<CheckIcon />}
//                       onClick={() => {
//                         setSelectedUser(request);
//                         setCredentialsDialog(true);
//                       }}
//                     >
//                       Verify
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TabPanel>

//         {/* Verified Users Tab */}
//         <TabPanel value={tabValue} index={1}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Username</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Company</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {verifiedUsers.map((user) => (
//                 <TableRow key={user._id}>
//                   <TableCell>{user.username}</TableCell>
//                   <TableCell>{user.email}</TableCell>
//                   <TableCell>{user.jobDetails?.companyName}</TableCell>
//                   <TableCell>
//                     <Button
//                       variant="outlined"
//                       color="error"
//                       startIcon={<DeleteIcon />}
//                       onClick={() => handleRemoveVerification(user._id)}
//                     >
//                       Remove Verification
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TabPanel>

//         {/* Credentials Dialog */}
//         <Dialog open={credentialsDialog} onClose={() => setCredentialsDialog(false)}>
//           <DialogTitle>Set Job Holder Credentials</DialogTitle>
//           <DialogContent>
//             <TextField
//               fullWidth
//               label="Username"
//               value={credentials.username}
//               onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
//               margin="normal"
//             />
//             <TextField
//               fullWidth
//               label="Password"
//               type="password"
//               value={credentials.password}
//               onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
//               margin="normal"
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setCredentialsDialog(false)}>Cancel</Button>
//             <Button onClick={handleVerify} variant="contained" color="primary">
//               Verify & Send Credentials
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Paper>
//     </Container>
//   );
// };

// const TabPanel = ({ children, value, index }) => (
//   <Box hidden={value !== index} sx={{ pt: 3 }}>
//     {value === index && children}
//   </Box>
// );

// export default AdminDashboard; 


import { useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    college: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/create-user', user);
      alert('User created and credentials sent via email');
    } catch (error) {
      alert('Error creating user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" onChange={(e) => setUser({ ...user, username: e.target.value })} />
      <input type="email" placeholder="Email" onChange={(e) => setUser({ ...user, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setUser({ ...user, password: e.target.value })} />
      <select onChange={(e) => setUser({ ...user, role: e.target.value })}>
        <option value="user">User</option>
        <option value="jobholder">Jobholder</option>
      </select>
      <input type="text" placeholder="College" onChange={(e) => setUser({ ...user, college: e.target.value })} />
      <button type="submit">Create User</button>
    </form>
  );
};

export default AdminDashboard;
