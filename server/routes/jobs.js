const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Get jobs posted by current user
router.get('/myjobs', auth, async (req, res) => {
  try {
    console.log('Fetching jobs for user:', req.user.userId);
    const jobs = await Job.find({ postedBy: req.user.userId })
      .sort({ createdAt: -1 });
    console.log('Found jobs:', jobs.length);
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching my jobs:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get jobs by college
router.get('/college/:college', async (req, res) => {
  try {
    const jobs = await Job.find({ college: req.params.college })
      .populate('postedBy', 'email')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create job
router.post('/', auth, upload.single('companyImage'), async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      postedBy: req.user.userId,
      companyImage: req.file ? req.file.path : null
    });
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update job
router.put('/:id', auth, upload.single('companyImage'), async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      companyImage: req.file ? req.file.path : undefined
    };

    // Only update fields that were provided
    Object.keys(jobData).forEach(key => 
      jobData[key] === undefined && delete jobData[key]
    );

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.userId },
      jobData,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete job
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ 
      _id: req.params.id, 
      postedBy: req.user.userId 
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    // Optionally delete associated image
    if (job.companyImage) {
      const imagePath = path.join(__dirname, '..', job.companyImage);
      fs.unlink(imagePath, err => {
        if (err) console.error('Error deleting image:', err);
      });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 