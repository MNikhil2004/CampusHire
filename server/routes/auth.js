const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request:', req.body);
    const { username, email, password, college, role } = req.body;

    // Validation
    if (!username || !email || !password || !college || !role) {
      return res.status(400).json({ 
        message: 'All fields are required',
        received: { username, email, college, role }
      });
    }

    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { email: email },
        { username: username }
      ]
    });

    if (user) {
      return res.status(400).json({ 
        message: user.email === email ? 'Email already exists' : 'Username already exists' 
      });
    }

    // In the register route, temporarily allow admin role
    if (!['user', 'jobholder'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password, // Password will be hashed by the pre-save middleware
      college,
      role
    });

    await user.save();
    console.log('User saved successfully:', user);

    // Generate token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role, 
        college: user.college,
        username: user.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        college: user.college
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, college: user.college },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send complete user data (excluding password)
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        college: user.college
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 