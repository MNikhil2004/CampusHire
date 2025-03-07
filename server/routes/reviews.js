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

// Delete review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review or the job
    if (review.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 