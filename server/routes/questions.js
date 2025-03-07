const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const auth = require('../middleware/auth');

// Get questions by job
router.get('/job/:jobId', async (req, res) => {
  try {
    console.log('Fetching questions for job:', req.params.jobId);
    const questions = await Question.find({ jobId: req.params.jobId })
      .sort({ createdAt: -1 }); // Most recent first
    console.log('Found questions:', questions.length);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add question
router.post('/', auth, async (req, res) => {
  try {
    const question = new Question({
      ...req.body,
      postedBy: req.user.userId
    });
    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete question
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user owns this question or the job
    if (question.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this question' });
    }

    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 