// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const Job = require('../models/Job');
// const { sendCredentialsEmail } = require('../utils/emailService');
// const adminAuth = require('../middleware/adminAuth');
// const multer = require('multer');
// const path = require('path');

// // Configure multer for offer letter uploads
// const storage = multer.diskStorage({
//   destination: './uploads/offerLetters',
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// const upload = multer({ storage });

// // Get all users for admin
// router.get('/users', adminAuth, async (req, res) => {
//   try {
//     const users = await User.find({ college: req.user.college });
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get pending job holder requests
// router.get('/pending-requests', adminAuth, async (req, res) => {
//   try {
//     const requests = await User.find({
//       college: req.user.college,
//       role: 'jobholder',
//       isVerified: false
//     });
//     res.json(requests);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Verify and create job holder account
// router.post('/verify-jobholder/:userId', adminAuth, async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findById(req.params.userId);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update user details
//     user.isVerified = true;
//     user.verifiedBy = req.user._id;
//     user.username = username;
//     user.password = password;
//     await user.save();

//     // Send credentials via email
//     await sendCredentialsEmail(
//       user.email,
//       username,
//       password,
//       user.jobDetails
//     );

//     res.json({ message: 'Job holder verified and credentials sent' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get all verified job holders
// router.get('/verified-jobholders', adminAuth, async (req, res) => {
//   try {
//     const jobHolders = await User.find({
//       college: req.user.college,
//       role: 'jobholder',
//       isVerified: true
//     });
//     res.json(jobHolders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Remove job
// router.delete('/jobs/:jobId', adminAuth, async (req, res) => {
//   try {
//     const job = await Job.findOneAndDelete({
//       _id: req.params.jobId,
//       college: req.user.college
//     });

//     if (!job) {
//       return res.status(404).json({ message: 'Job not found' });
//     }

//     res.json({ message: 'Job removed successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Remove job holder verification
// router.post('/remove-verification/:userId', adminAuth, async (req, res) => {
//   try {
//     const user = await User.findOneAndUpdate(
//       { _id: req.params.userId, college: req.user.college },
//       { isVerified: false, verifiedBy: null },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ message: 'Verification removed successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router; 

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');

// Get pending jobholder requests
router.get('/pending-requests', adminAuth, async (req, res) => {
  try {
    const requests = await User.find({ role: 'jobholder', isVerified: false });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify and create jobholder account
router.post('/verify-jobholder/:userId', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = true;
    await user.save();

    res.json({ message: 'Jobholder verified' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all verified jobholders
router.get('/verified-jobholders', adminAuth, async (req, res) => {
  try {
    const jobHolders = await User.find({ role: 'jobholder', isVerified: true });
    res.json(jobHolders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
