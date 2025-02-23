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

// Get jobs by college (for students)
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

// Get jobs posted by current user (for job holders)
router.get('/myjobs', auth, async (req, res) => {
  try {
    if (req.user.role !== 'jobholder') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const jobs = await Job.find({ postedBy: req.user.userId })
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

// Update job (only owner can update)
router.put('/:id', auth, upload.single('companyImage'), async (req, res) => {
  try {
    const job = await Job.findOne({ 
      _id: req.params.id,
      postedBy: req.user.userId // Ensure user owns this job
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        companyImage: req.file ? req.file.path : job.companyImage
      },
      { new: true }
    );

    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete job (only owner can delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    // First check if job exists and belongs to user
    const job = await Job.findOne({
      _id: req.params.id,
      postedBy: req.user.userId
    });

    if (!job) {
      return res.status(404).json({ 
        message: 'Job not found or you are not authorized to delete this job' 
      });
    }

    // Delete the job
    await Job.deleteOne({ _id: req.params.id });

    // Delete associated image if exists
    if (job.companyImage) {
      const imagePath = path.join(__dirname, '..', job.companyImage);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (err) {
        console.error('Error deleting image file:', err);
        // Continue with response even if image deletion fails
      }
    }

    // Also delete associated questions and reviews (if you have these collections)
    // await Question.deleteMany({ jobId: req.params.id });
    // await Review.deleteMany({ jobId: req.params.id });

    res.json({ 
      success: true,
      message: 'Job and associated data deleted successfully' 
    });

  } catch (error) {
    console.error('Error in job deletion:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting job',
      error: error.message 
    });
  }
});

module.exports = router; 