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

module.exports = router; 