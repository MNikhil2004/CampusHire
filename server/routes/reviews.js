const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// Get reviews by job
router.get('/job/:jobId', async (req, res) => {
  try {
    console.log('Fetching reviews for job:', req.params.jobId);
    const reviews = await Review.find({ jobId: req.params.jobId })
      .sort({ createdAt: -1 }); // Most recent first
    console.log('Found reviews:', reviews.length);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add review
router.post('/', auth, async (req, res) => {
  try {
    const review = new Review({
      ...req.body,
      postedBy: req.user.userId
    });
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 