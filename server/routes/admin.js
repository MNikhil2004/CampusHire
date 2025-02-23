const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Get all users for admin
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ college: req.user.college });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify job holder
router.post('/verify/:userId', adminAuth, async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true;
    user.verifiedBy = req.user.userId;
    user.username = username;
    user.password = password; // Make sure to hash this

    await user.save();
    res.json({ message: 'User verified successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove job
router.delete('/jobs/:jobId', adminAuth, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.jobId,
      college: req.user.college
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove verification from job holder
router.post('/remove-verification/:userId', adminAuth, async (req, res) => {
  try {
    const user = await User.findOne({ 
      _id: req.params.userId,
      college: req.user.college
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = false;
    user.verifiedBy = undefined;
    await user.save();

    res.json({ message: 'Verification removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 